'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getCollection, updateDocument, createDocument } from './firestore';

interface Theme {
  id?: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  layout: 'minimal' | 'cards' | 'dark' | 'modern';
}

interface ThemeContextType {
  theme: Theme | null;
  loading: boolean;
  updateTheme: (newTheme: Partial<Theme>) => Promise<void>;
  applyTheme: (theme: Theme) => void;
}

const defaultTheme: Theme = {
  primaryColor: '#10b981', // emerald-500
  secondaryColor: '#14b8a6', // teal-500
  backgroundColor: '#ffffff', // white
  textColor: '#1f2937', // gray-800
  accentColor: '#f59e0b', // amber-500
  fontFamily: 'Inter',
  layout: 'modern',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);

  // Load theme from Firebase
  useEffect(() => {
    const loadTheme = async () => {
      if (!user) {
        setTheme(defaultTheme);
        setLoading(false);
        return;
      }

      try {
        const { data: themesData } = await getCollection('themes', [
          { field: 'userId', operator: '==', value: user.uid }
        ]);

        if (themesData && themesData.length > 0) {
          const userTheme = themesData[0] as Theme;
          setTheme(userTheme);
          applyTheme(userTheme);
        } else {
          setTheme(defaultTheme);
          applyTheme(defaultTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        setTheme(defaultTheme);
        applyTheme(defaultTheme);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, [user]);

  const updateTheme = async (newTheme: Partial<Theme>) => {
    if (!user) return;

    try {
      const updatedTheme = { 
        ...theme, 
        ...newTheme,
        primaryColor: newTheme.primaryColor || theme?.primaryColor || '#10b981',
        secondaryColor: newTheme.secondaryColor || theme?.secondaryColor || '#14b8a6',
        backgroundColor: newTheme.backgroundColor || theme?.backgroundColor || '#ffffff',
        textColor: newTheme.textColor || theme?.textColor || '#1f2937',
        accentColor: newTheme.accentColor || theme?.accentColor || '#f59e0b',
        fontFamily: newTheme.fontFamily || theme?.fontFamily || 'Inter',
        layout: newTheme.layout || theme?.layout || 'modern'
      };
      setTheme(updatedTheme);
      applyTheme(updatedTheme);

      // Save to Firebase
      const { data: existingThemes } = await getCollection('themes', [
        { field: 'userId', operator: '==', value: user.uid }
      ]);

      if (existingThemes && existingThemes.length > 0) {
        await updateDocument('themes', existingThemes[0].id, updatedTheme);
      } else {
        await createDocument('themes', {
          ...updatedTheme,
          userId: user.uid,
        });
      }
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  const applyTheme = (themeToApply: Theme) => {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--theme-primary', themeToApply.primaryColor);
    root.style.setProperty('--theme-secondary', themeToApply.secondaryColor);
    root.style.setProperty('--theme-background', themeToApply.backgroundColor);
    root.style.setProperty('--theme-text', themeToApply.textColor);
    root.style.setProperty('--theme-accent', themeToApply.accentColor);
    root.style.setProperty('--theme-font', themeToApply.fontFamily);
  };

  return (
    <ThemeContext.Provider value={{ theme, loading, updateTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
