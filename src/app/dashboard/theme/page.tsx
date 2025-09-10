'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/AuthContext';
import { createDocument, getCollection, updateDocument } from '@/lib/firestore';
import { Palette, Save, Eye, RotateCcw } from 'lucide-react';

const predefinedThemes = [
  {
    name: 'Modern Blue',
    primaryColor: '#3b82f6',
    secondaryColor: '#1d4ed8',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#f59e0b',
    fontFamily: 'Inter'
  },
  {
    name: 'Emerald Green',
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#f59e0b',
    fontFamily: 'Inter'
  },
  {
    name: 'Purple Dream',
    primaryColor: '#8b5cf6',
    secondaryColor: '#7c3aed',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#f59e0b',
    fontFamily: 'Inter'
  },
  {
    name: 'Sunset Orange',
    primaryColor: '#f97316',
    secondaryColor: '#ea580c',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#3b82f6',
    fontFamily: 'Inter'
  },
  {
    name: 'Rose Pink',
    primaryColor: '#ec4899',
    secondaryColor: '#db2777',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#10b981',
    fontFamily: 'Inter'
  },
  {
    name: 'Dark Mode',
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    backgroundColor: '#0f172a',
    textColor: '#f1f5f9',
    accentColor: '#f59e0b',
    fontFamily: 'Inter'
  }
];

export default function ThemePage() {
  const { user } = useAuth();
  const [customTheme, setCustomTheme] = useState({
    primaryColor: '#10b981',
    secondaryColor: '#14b8a6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#f59e0b',
    fontFamily: 'Inter'
  });
  const [saving, setSaving] = useState(false);
  const [themeId, setThemeId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Load existing theme
  useEffect(() => {
    const loadTheme = async () => {
      if (!user) return;

      try {
        const { data: themesData } = await getCollection('themes', [
          { field: 'userId', operator: '==', value: user.uid }
        ]);

        if (themesData && themesData.length > 0) {
          const theme = themesData[0] as any;
          setCustomTheme({
            primaryColor: theme.primaryColor || '#10b981',
            secondaryColor: theme.secondaryColor || '#14b8a6',
            backgroundColor: theme.backgroundColor || '#ffffff',
            textColor: theme.textColor || '#1f2937',
            accentColor: theme.accentColor || '#f59e0b',
            fontFamily: theme.fontFamily || 'Inter'
          });
          setThemeId(theme.id);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();
  }, [user]);

  // Apply theme to preview
  useEffect(() => {
    if (previewMode) {
      const root = document.documentElement;
      root.style.setProperty('--theme-primary', customTheme.primaryColor);
      root.style.setProperty('--theme-secondary', customTheme.secondaryColor);
      root.style.setProperty('--theme-background', customTheme.backgroundColor);
      root.style.setProperty('--theme-text', customTheme.textColor);
      root.style.setProperty('--theme-accent', customTheme.accentColor);
      root.style.setProperty('--theme-font', customTheme.fontFamily);
    }
  }, [customTheme, previewMode]);

  const handleColorChange = (field: string, value: string) => {
    setCustomTheme(prev => ({ ...prev, [field]: value }));
  };

  const applyPredefinedTheme = (theme: typeof predefinedThemes[0]) => {
    setCustomTheme(theme);
  };

  const resetToDefault = () => {
    setCustomTheme({
      primaryColor: '#10b981',
      secondaryColor: '#14b8a6',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      accentColor: '#f59e0b',
      fontFamily: 'Inter'
    });
  };

  const saveTheme = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const themeData = {
        userId: user.uid,
        ...customTheme,
        layout: 'modern'
      };

      if (themeId) {
        await updateDocument('themes', themeId, themeData);
      } else {
        const { id } = await createDocument('themes', themeData);
        setThemeId(id);
      }

      // Apply theme globally
      const root = document.documentElement;
      root.style.setProperty('--theme-primary', customTheme.primaryColor);
      root.style.setProperty('--theme-secondary', customTheme.secondaryColor);
      root.style.setProperty('--theme-background', customTheme.backgroundColor);
      root.style.setProperty('--theme-text', customTheme.textColor);
      root.style.setProperty('--theme-accent', customTheme.accentColor);
      root.style.setProperty('--theme-font', customTheme.fontFamily);

      console.log('Theme saved successfully');
    } catch (error) {
      console.error('Error saving theme:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Authentication Required</h1>
          <p className="text-muted-foreground">Please log in to access the theme page.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
      <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Customize Theme</h1>
          <p className="text-muted-foreground">Personalize your portfolio's appearance</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {previewMode ? 'Exit Preview' : 'Preview'}
          </Button>
          <Button
            onClick={saveTheme}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Theme'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predefined Themes */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Predefined Themes
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {predefinedThemes.map((theme, index) => (
              <button
                key={index}
                onClick={() => applyPredefinedTheme(theme)}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors text-left"
              >
                <div className="flex gap-2 mb-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: theme.primaryColor }}
                  ></div>
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: theme.secondaryColor }}
                  ></div>
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: theme.accentColor }}
                  ></div>
                </div>
                <p className="text-sm font-medium text-foreground">{theme.name}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Custom Theme Editor */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Custom Theme
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefault}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
          
            <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Primary Color
                </label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={customTheme.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={customTheme.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Secondary Color
                </label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={customTheme.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={customTheme.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={customTheme.backgroundColor}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={customTheme.backgroundColor}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="flex-1"
                  />
              </div>
            </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Text Color
                </label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={customTheme.textColor}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={customTheme.textColor}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Accent Color
                </label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={customTheme.accentColor}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={customTheme.accentColor}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="flex-1"
                  />
                </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Font Family
            </label>
            <select
              value={customTheme.fontFamily}
              onChange={(e) => handleColorChange('fontFamily', e.target.value)}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-md bg-background text-foreground"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Montserrat">Montserrat</option>
            </select>
          </div>
          </div>
        </div>
      </Card>
          </div>
          
      {/* Theme Preview */}
      {previewMode && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Theme Preview</h2>
          <div 
            className="p-6 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600"
            style={{
              backgroundColor: customTheme.backgroundColor,
              color: customTheme.textColor,
              fontFamily: customTheme.fontFamily
            }}
          >
            <h3 
              className="text-2xl font-bold mb-2"
              style={{ color: customTheme.primaryColor }}
            >
              Your Name
            </h3>
            <p 
              className="text-lg mb-4"
              style={{ color: customTheme.accentColor }}
            >
              Professional Title
            </p>
            <p className="mb-4">
              This is how your portfolio will look with the selected theme. 
              The colors and fonts will be applied throughout your entire portfolio.
            </p>
            <div className="flex gap-2">
              <button 
                className="px-4 py-2 rounded text-white"
                style={{ backgroundColor: customTheme.primaryColor }}
              >
                Primary Button
              </button>
              <button 
                className="px-4 py-2 rounded border"
                style={{ 
                  borderColor: customTheme.secondaryColor,
                  color: customTheme.secondaryColor
                }}
              >
                Secondary Button
              </button>
          </div>
        </div>
      </Card>
      )}
    </div>
  );
}