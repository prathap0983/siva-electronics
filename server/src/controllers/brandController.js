import { supabase } from '../config/supabase.js';

export const getAllBrands = async (req, res, next) => {
  try {
    const { data: brands, error } = await supabase
      .from('brands')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    res.status(200).json(brands);
  } catch (error) {
    next(error);
  }
};

export const createBrand = async (req, res, next) => {
  try {
    const { name, logo_url } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Brand name is required' });
    }

    const { data: brand, error } = await supabase
      .from('brands')
      .insert({ name, logo_url })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'A brand with this name already exists' });
      }
      throw error;
    }

    res.status(201).json(brand);
  } catch (error) {
    next(error);
  }
};

export const updateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, logo_url } = req.body;

    const { data: brand, error } = await supabase
      .from('brands')
      .update({ name, logo_url })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'A brand with this name already exists' });
      }
      throw error;
    }

    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    res.status(200).json(brand);
  } catch (error) {
    next(error);
  }
};

export const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    res.status(200).json({ message: 'Brand deleted successfully' });
  } catch (error) {
    next(error);
  }
};
