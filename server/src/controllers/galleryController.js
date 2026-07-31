import { supabase } from '../config/supabase.js';
import cloudinary from '../config/cloudinary.js';

export const getAllGallery = async (req, res, next) => {
  try {
    const { category } = req.query;

    let query = supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data: items, error } = await query;
    if (error) throw error;

    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

export const createGallery = async (req, res, next) => {
  try {
    const { title, image_url, category } = req.body;

    if (!title || !image_url || !category) {
      return res.status(400).json({ error: 'Title, image_url, and category are required' });
    }

    // Validate category value
    const allowedCategories = ['Shop', 'Products', 'Repair', 'Installation', 'Spare Parts'];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ error: `Invalid category. Must be one of: ${allowedCategories.join(', ')}` });
    }

    const { data: item, error } = await supabase
      .from('gallery')
      .insert({ title, image_url, category })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const updateGallery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category } = req.body;

    const updatePayload = {};
    if (title !== undefined) updatePayload.title = title;
    if (category !== undefined) {
      const allowedCategories = ['Shop', 'Products', 'Repair', 'Installation', 'Spare Parts'];
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({ error: `Invalid category. Must be one of: ${allowedCategories.join(', ')}` });
      }
      updatePayload.category = category;
    }

    const { data: item, error } = await supabase
      .from('gallery')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!item) return res.status(404).json({ error: 'Gallery item not found' });

    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteGallery = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Fetch the item first to get the image URL (for Cloudinary deletion)
    const { data: item, error: fetchError } = await supabase
      .from('gallery')
      .select('image_url')
      .eq('id', id)
      .single();

    if (fetchError || !item) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    // Delete from Supabase
    const { error: deleteError } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    // Attempt to delete from Cloudinary
    try {
      // Cloudinary URL usually looks like: https://res.cloudinary.com/cloudname/image/upload/v12345/folder/public_id.jpg
      // We need to extract 'folder/public_id' or 'public_id'
      const parts = item.image_url.split('/');
      const uploadIdx = parts.indexOf('upload');
      if (uploadIdx !== -1 && parts.length > uploadIdx + 2) {
        // Grab everything after the version segment (which starts with 'v' and is numeric)
        const versionSegment = parts[uploadIdx + 1];
        let fileSegments = parts.slice(uploadIdx + 2);
        if (versionSegment.startsWith('v') && !isNaN(versionSegment.substring(1))) {
          // version tag was included, slide fileSegments
        } else {
          fileSegments = parts.slice(uploadIdx + 1);
        }
        
        // Remove file extension from the last segment
        const lastPartIdx = fileSegments.length - 1;
        const lastPartDotIdx = fileSegments[lastPartIdx].lastIndexOf('.');
        if (lastPartDotIdx !== -1) {
          fileSegments[lastPartIdx] = fileSegments[lastPartIdx].substring(0, lastPartDotIdx);
        }
        
        const publicId = fileSegments.join('/');
        console.log(`Deleting image from Cloudinary with publicId: ${publicId}`);
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (clError) {
      console.error('Failed to delete image from Cloudinary:', clError);
    }

    res.status(200).json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    next(error);
  }
};
