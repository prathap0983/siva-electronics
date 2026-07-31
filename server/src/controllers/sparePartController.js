import { supabase } from '../config/supabase.js';

export const getAllSpareParts = async (req, res, next) => {
  try {
    const { search, brand, available } = req.query;

    let query = supabase
      .from('spare_parts')
      .select('*, brands!left(*), inventory(stock_qty, low_stock_threshold)');

    // Search query
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Brand filter
    if (brand) {
      query = query.eq('brand_id', brand);
    }

    // Availability filter
    if (available === 'true') {
      query = query.eq('is_available', true);
    } else if (available === 'false') {
      query = query.eq('is_available', false);
    }

    query = query.order('created_at', { ascending: false });

    const { data: parts, error } = await query;
    if (error) throw error;

    const formattedParts = parts.map(part => ({
      ...part,
      brand: part.brands,
      stock_qty: part.inventory?.[0]?.stock_qty ?? part.stock_qty,
      low_stock_threshold: part.inventory?.[0]?.low_stock_threshold ?? 5,
      brands: undefined,
      inventory: undefined
    }));

    res.status(200).json(formattedParts);
  } catch (error) {
    next(error);
  }
};

export const getSparePartById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: part, error } = await supabase
      .from('spare_parts')
      .select('*, brands!left(*), inventory(id, stock_qty, low_stock_threshold)')
      .eq('id', id)
      .single();

    if (error || !part) {
      return res.status(404).json({ error: 'Spare part not found' });
    }

    const formattedPart = {
      ...part,
      brand: part.brands,
      inventory_id: part.inventory?.[0]?.id,
      stock_qty: part.inventory?.[0]?.stock_qty ?? part.stock_qty,
      low_stock_threshold: part.inventory?.[0]?.low_stock_threshold ?? 5,
      brands: undefined,
      inventory: undefined
    };

    res.status(200).json(formattedPart);
  } catch (error) {
    next(error);
  }
};

export const createSparePart = async (req, res, next) => {
  try {
    const {
      name,
      compatible_models = [],
      brand_id,
      price,
      stock_qty = 0,
      is_available = true,
      image_url,
      low_stock_threshold = 5
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required fields.' });
    }

    // 1. Insert spare part
    const { data: part, error: partError } = await supabase
      .from('spare_parts')
      .insert({
        name,
        compatible_models,
        brand_id: brand_id || null,
        price: parseFloat(price),
        stock_qty: parseInt(stock_qty),
        is_available,
        image_url: image_url || null
      })
      .select()
      .single();

    if (partError) throw partError;

    // 2. Setup inventory item
    const { data: inventory, error: invError } = await supabase
      .from('inventory')
      .insert({
        item_type: 'spare_part',
        spare_part_id: part.id,
        stock_qty: parseInt(stock_qty),
        low_stock_threshold: parseInt(low_stock_threshold)
      })
      .select()
      .single();

    if (invError) {
      console.error('Error initializing spare part inventory:', invError);
    } else {
      // 3. Log initial stock
      const { error: histError } = await supabase
        .from('inventory_history')
        .insert({
          inventory_id: inventory.id,
          quantity_change: parseInt(stock_qty),
          type: 'initial',
          notes: 'Initial stock setup upon spare part creation'
        });

      if (histError) console.error('Error writing stock history:', histError);
    }

    const { data: completePart } = await supabase
      .from('spare_parts')
      .select('*, brands!left(*), inventory(stock_qty, low_stock_threshold)')
      .eq('id', part.id)
      .single();

    res.status(201).json({
      ...completePart,
      brand: completePart.brands,
      stock_qty: completePart.inventory?.[0]?.stock_qty ?? completePart.stock_qty,
      low_stock_threshold: completePart.inventory?.[0]?.low_stock_threshold ?? 5,
      brands: undefined,
      inventory: undefined
    });
  } catch (error) {
    next(error);
  }
};

export const updateSparePart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      compatible_models,
      brand_id,
      price,
      stock_qty,
      is_available,
      image_url,
      low_stock_threshold
    } = req.body;

    const updatePayload = {};
    if (name !== undefined) updatePayload.name = name;
    if (compatible_models !== undefined) updatePayload.compatible_models = compatible_models;
    if (brand_id !== undefined) updatePayload.brand_id = brand_id || null;
    if (price !== undefined) updatePayload.price = parseFloat(price);
    if (stock_qty !== undefined) updatePayload.stock_qty = parseInt(stock_qty);
    if (is_available !== undefined) updatePayload.is_available = is_available;
    if (image_url !== undefined) updatePayload.image_url = image_url || null;

    // 1. Update main record
    const { data: part, error: partError } = await supabase
      .from('spare_parts')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (partError) throw partError;
    if (!part) return res.status(404).json({ error: 'Spare part not found' });

    // 2. Sync inventory & log history
    if (low_stock_threshold !== undefined || stock_qty !== undefined) {
      const invUpdate = {};
      if (low_stock_threshold !== undefined) invUpdate.low_stock_threshold = parseInt(low_stock_threshold);
      if (stock_qty !== undefined) invUpdate.stock_qty = parseInt(stock_qty);

      const { data: currentInv } = await supabase
        .from('inventory')
        .select('*')
        .eq('spare_part_id', id)
        .single();

      if (currentInv) {
        const { error: invError } = await supabase
          .from('inventory')
          .update(invUpdate)
          .eq('id', currentInv.id);

        if (invError) console.error('Error updating spare part inventory:', invError);

        if (stock_qty !== undefined && currentInv.stock_qty !== parseInt(stock_qty)) {
          const diff = parseInt(stock_qty) - currentInv.stock_qty;
          await supabase
            .from('inventory_history')
            .insert({
              inventory_id: currentInv.id,
              quantity_change: diff,
              type: 'set',
              notes: 'Stock updated during spare part edit'
            });
        }
      }
    }

    const { data: completePart } = await supabase
      .from('spare_parts')
      .select('*, brands!left(*), inventory(stock_qty, low_stock_threshold)')
      .eq('id', id)
      .single();

    res.status(200).json({
      ...completePart,
      brand: completePart.brands,
      stock_qty: completePart.inventory?.[0]?.stock_qty ?? completePart.stock_qty,
      low_stock_threshold: completePart.inventory?.[0]?.low_stock_threshold ?? 5,
      brands: undefined,
      inventory: undefined
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSparePart = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('spare_parts')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Spare part not found' });
    }

    res.status(200).json({ message: 'Spare part deleted successfully' });
  } catch (error) {
    next(error);
  }
};
