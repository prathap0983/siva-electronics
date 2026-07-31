import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/api.js';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to load store settings:', error);
      // Fail-safe defaults
      setSettings({
        business_name: 'Siva Electronics',
        phone: '+91 8072300191',
        whatsapp: '+918072300191',
        address: 'Siva electronics,north car street,vava complex,tiruchendur 628205',
        business_hours: { weekdays: '9:00 AM - 8:30 PM', sunday: '10:00 AM - 5:00 PM' },
        social_links: { facebook: 'https://facebook.com', instagram: 'https://instagram.com', youtube: 'https://youtube.com' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = () => {
    fetchSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
