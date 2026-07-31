import { supabase } from '../config/supabase.js';
import { slugify } from '../utils/slugify.js';

export const getAllProducts = async (req, res, next) => {
  try {
    const {
      search,
      brand,
      category,
      minPrice,
      maxPrice,
      available,
      featured,
      page = 1,
      limit = 12
    } = req.query;

    let query = supabase
      .from('products')
      .select('*, brands!left(*), categories!left(*), product_images(*), inventory(stock_qty, low_stock_threshold)', { count: 'exact' });

    // Apply Search
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Apply Featured Filter
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    // Apply Availability Filter
    if (available === 'true') {
      query = query.eq('is_available', true);
    } else if (available === 'false') {
      query = query.eq('is_available', false);
    }

    // Apply Brand Filter (can be brand_id or brand name)
    if (brand) {
      query = query.eq('brand_id', brand);
    }

    // Apply Category Filter
    if (category) {
      query = query.eq('category_id', category);
    }

    // Apply Price Range
    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }

    // Sort by latest
    query = query.order('created_at', { ascending: false });

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    const { data: products, count, error } = await query.range(from, to);

    if (error) throw error;

    // Reshape data to make brand and category fields flatter for client convenience
    const formattedProducts = products.map(prod => ({
      ...prod,
      brand: prod.brands,
      category: prod.categories,
      stock_qty: prod.inventory?.[0]?.stock_qty ?? 0,
      low_stock_threshold: prod.inventory?.[0]?.low_stock_threshold ?? 5,
      brands: undefined,
      categories: undefined,
      inventory: undefined
    }));

    res.status(200).json({
      products: formattedProducts,
      total: count,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(count / limitNum)
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabase
      .from('products')
      .select('*, brands!left(*), categories!left(*), product_images(*), inventory(id, stock_qty, low_stock_threshold)')
      .eq('id', id)
      .single();

    if (error || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const formattedProduct = {
      ...product,
      brand: product.brands,
      category: product.categories,
      inventory_id: product.inventory?.[0]?.id,
      stock_qty: product.inventory?.[0]?.stock_qty ?? 0,
      low_stock_threshold: product.inventory?.[0]?.low_stock_threshold ?? 5,
      brands: undefined,
      categories: undefined,
      inventory: undefined
    };

    res.status(200).json(formattedProduct);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      brand_id,
      category_id,
      price,
      description,
      specifications = {},
      is_featured = false,
      is_available = true,
      images = [], // Array of image URLs
      stock_qty = 0,
      low_stock_threshold = 5
    } = req.body;

    if (!name || !price || !description) {
      return res.status(400).json({ error: 'Name, price, and description are required fields.' });
    }

    const slug = `${slugify(name)}-${Date.now().toString().slice(-4)}`;

    // 1. Insert product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name,
        slug,
        brand_id: brand_id || null,
        category_id: category_id || null,
        price: parseFloat(price),
        description,
        specifications,
        is_featured,
        is_available
      })
      .select()
      .single();

    if (productError) throw productError;

    // 2. Insert product images if provided
    if (images.length > 0) {
      const imagePayloads = images.map((url, idx) => ({
        product_id: product.id,
        image_url: url,
        is_primary: idx === 0
      }));

      const { error: imgError } = await supabase
        .from('product_images')
        .insert(imagePayloads);

      if (imgError) {
        console.error('Error inserting product images:', imgError);
      }
    }

    // 3. Create stock inventory entry
    const { data: inventory, error: invError } = await supabase
      .from('inventory')
      .insert({
        item_type: 'product',
        product_id: product.id,
        stock_qty: parseInt(stock_qty),
        low_stock_threshold: parseInt(low_stock_threshold)
      })
      .select()
      .single();

    if (invError) {
      console.error('Error initializing product inventory:', invError);
    } else {
      // 4. Log initial stock in history
      const { error: histError } = await supabase
        .from('inventory_history')
        .insert({
          inventory_id: inventory.id,
          quantity_change: parseInt(stock_qty),
          type: 'initial',
          notes: 'Initial stock setup upon product creation'
        });

      if (histError) console.error('Error writing stock history:', histError);
    }

    // Fetch complete product details to return
    const { data: completeProduct } = await supabase
      .from('products')
      .select('*, brands!left(*), categories!left(*), product_images(*), inventory(stock_qty, low_stock_threshold)')
      .eq('id', product.id)
      .single();

    res.status(201).json({
      ...completeProduct,
      brand: completeProduct.brands,
      category: completeProduct.categories,
      stock_qty: completeProduct.inventory?.[0]?.stock_qty ?? 0,
      low_stock_threshold: completeProduct.inventory?.[0]?.low_stock_threshold ?? 5,
      brands: undefined,
      categories: undefined,
      inventory: undefined
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      brand_id,
      category_id,
      price,
      description,
      specifications,
      is_featured,
      is_available,
      images, // array of image URLs to sync
      stock_qty,
      low_stock_threshold
    } = req.body;

    // 1. Update product details
    const updatePayload = {};
    if (name !== undefined) {
      updatePayload.name = name;
      updatePayload.slug = `${slugify(name)}-${id.slice(-4)}`;
    }
    if (brand_id !== undefined) updatePayload.brand_id = brand_id || null;
    if (category_id !== undefined) updatePayload.category_id = category_id || null;
    if (price !== undefined) updatePayload.price = parseFloat(price);
    if (description !== undefined) updatePayload.description = description;
    if (specifications !== undefined) updatePayload.specifications = specifications;
    if (is_featured !== undefined) updatePayload.is_featured = is_featured;
    if (is_available !== undefined) updatePayload.is_available = is_available;

    const { data: product, error: productError } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (productError) throw productError;
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // 2. Sync images if supplied
    if (images !== undefined) {
      // Simple sync: delete existing images, insert new ones
      await supabase.from('product_images').delete().eq('product_id', id);

      if (images.length > 0) {
        const imagePayloads = images.map((url, idx) => ({
          product_id: id,
          image_url: url,
          is_primary: idx === 0
        }));

        const { error: imgError } = await supabase
          .from('product_images')
          .insert(imagePayloads);

        if (imgError) console.error('Error updating product images:', imgError);
      }
    }

    // 3. Update inventory low stock threshold if supplied
    if (low_stock_threshold !== undefined || stock_qty !== undefined) {
      const invUpdate = {};
      if (low_stock_threshold !== undefined) invUpdate.low_stock_threshold = parseInt(low_stock_threshold);
      
      // Note: Direct stock adjustments are handled via inventory endpoints, 
      // but we update stock here if supplied during basic product edit.
      if (stock_qty !== undefined) invUpdate.stock_qty = parseInt(stock_qty);

      const { data: currentInv } = await supabase
        .from('inventory')
        .select('*')
        .eq('product_id', id)
        .single();

      if (currentInv) {
        const { error: invError } = await supabase
          .from('inventory')
          .update(invUpdate)
          .eq('id', currentInv.id);

        if (invError) console.error('Error updating inventory threshold:', invError);

        // Log if quantity changed
        if (stock_qty !== undefined && currentInv.stock_qty !== parseInt(stock_qty)) {
          const diff = parseInt(stock_qty) - currentInv.stock_qty;
          await supabase
            .from('inventory_history')
            .insert({
              inventory_id: currentInv.id,
              quantity_change: diff,
              type: 'set',
              notes: 'Stock updated during product edit'
            });
        }
      }
    }

    // Fetch complete updated product details
    const { data: completeProduct } = await supabase
      .from('products')
      .select('*, brands!left(*), categories!left(*), product_images(*), inventory(stock_qty, low_stock_threshold)')
      .eq('id', id)
      .single();

    res.status(200).json({
      ...completeProduct,
      brand: completeProduct.brands,
      category: completeProduct.categories,
      stock_qty: completeProduct.inventory?.[0]?.stock_qty ?? 0,
      low_stock_threshold: completeProduct.inventory?.[0]?.low_stock_threshold ?? 5,
      brands: undefined,
      categories: undefined,
      inventory: undefined
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
