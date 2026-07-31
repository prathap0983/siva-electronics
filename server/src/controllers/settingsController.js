import { supabase } from '../config/supabase.js';

export const getSettings = async (req, res, next) => {
  try {
    // Fetch the first settings record
    let { data: settings, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1);

    if (error) throw error;

    // Seed default if settings are empty
    if (!settings || settings.length === 0) {
      const defaultSettings = {
        business_name: 'Siva Electronics',
        phone: '+919876543210',
        whatsapp: '+919876543210',
        address: '123, Main Bazaar Street, Near Post Office, Townville, Tamil Nadu, 600001',
        business_hours: { weekdays: '9:00 AM - 8:30 PM', sunday: '10:00 AM - 5:00 PM' },
        social_links: { facebook: 'https://facebook.com', instagram: 'https://instagram.com', youtube: 'https://youtube.com' }
      };

      const { data: newSettings, error: insertError } = await supabase
        .from('settings')
        .insert(defaultSettings)
        .select()
        .single();

      if (insertError) throw insertError;
      return res.status(200).json(newSettings);
    }

    res.status(200).json(settings[0]);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const {
      business_name,
      logo_url,
      phone,
      whatsapp,
      address,
      business_hours,
      social_links
    } = req.body;

    // Get the first row id to update
    const { data: settingsList, error: fetchError } = await supabase
      .from('settings')
      .select('id')
      .limit(1);

    if (fetchError) throw fetchError;

    const updatePayload = {
      updated_at: new Date().toISOString()
    };
    if (business_name !== undefined) updatePayload.business_name = business_name;
    if (logo_url !== undefined) updatePayload.logo_url = logo_url;
    if (phone !== undefined) updatePayload.phone = phone;
    if (whatsapp !== undefined) updatePayload.whatsapp = whatsapp;
    if (address !== undefined) updatePayload.address = address;
    if (business_hours !== undefined) updatePayload.business_hours = business_hours;
    if (social_links !== undefined) updatePayload.social_links = social_links;

    let result;
    if (settingsList && settingsList.length > 0) {
      // Update existing
      const { data, error } = await supabase
        .from('settings')
        .update(updatePayload)
        .eq('id', settingsList[0].id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert new if somehow not present
      const { data, error } = await supabase
        .from('settings')
        .insert(updatePayload)
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    res.status(200).json({
      message: 'Store settings updated successfully',
      settings: result
    });
  } catch (error) {
    next(error);
  }
};
