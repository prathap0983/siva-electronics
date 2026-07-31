import express from 'express';
const router = express.Router();

import upload from '../config/multer.js';
import { supabase } from '../config/supabase.js';
import cloudinary from '../config/cloudinary.js';
import { requireAdmin } from '../middleware/auth.js';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';

// 1. Connection Test Endpoint (Declared before /:id to prevent routing clash)
router.get('/test', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    res.json({ data, error });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
});

// 2. Simple Product Add Endpoint (Declared before /:id to prevent routing clash)
router.post('/add', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const uploadResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      {
        folder: 'products'
      }
    );

    const imageUrl = uploadResult.secure_url;

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          price: parseFloat(price),
          category,
          description,
          image_url: imageUrl
        }
      ])
      .select();

    if (error) {
      console.error('Supabase DB Insert Error:', error.message);
      return res.status(400).json({ error: error.message });
    }

    res.json(data[0]);

  } catch (error) {
    console.error('Add Product Route Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 3. Database CRUD Endpoints
router.get('/', async (req, res, next) => {
  // If query parameters for dashboard pagination/filters are active, use controller
  if (req.query.page || req.query.limit || req.query.featured || req.query.brand || req.query.category) {
    return getAllProducts(req, res, next);
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 3.1. Update Product API
router.put("/:id", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description, existing_image_url } = req.body;

    let imageUrl = existing_image_url;

    // If a new image file is uploaded
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "products"
        }
      );
      imageUrl = result.secure_url;
    }

    const { data, error } = await supabase
      .from("products")
      .update({
        name,
        price: parseFloat(price),
        category,
        description,
        image_url: imageUrl
      })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data[0]);

  } catch (error) {
    console.error("Update product error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 3.2. Delete Product API (Purges supabase row and destroys cloudinary asset)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get product image details for Cloudinary purge
    const { data: product } = await supabase
      .from("products")
      .select("image_url")
      .eq("id", id)
      .single();

    // 2. Purge record from Supabase
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // 3. Purge image from Cloudinary
    if (product && product.image_url) {
      try {
        const parts = product.image_url.split("/");
        const filename = parts[parts.length - 1];
        const publicId = `products/${filename.split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary asset deletion error:", cloudinaryError.message);
      }
    }

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    console.error("Delete product error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 4. Cloudinary Upload Endpoint
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      {
        folder: 'products'
      }
    );

    res.json({
      message: 'Image uploaded successfully',
      url: result.secure_url
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// 5. Dynamic wildcard route (Always at the bottom to prevent parameter clashes)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({
      error: error.message
    });
  }

  res.json(data);
});

export default router;
