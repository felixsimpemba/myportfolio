'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { createSampleData, clearUserData } from '@/lib/sampleData';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

export default function TestDataPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleCreateSampleData = async () => {
    if (!user) {
      setResult({ success: false, message: 'Please log in first' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await createSampleData(user.uid);
      if (response.success) {
        setResult({ 
          success: true, 
          message: 'Sample data created successfully! You can now view your portfolio.' 
        });
      } else {
        setResult({ 
          success: false, 
          message: 'Failed to create sample data. Please try again.' 
        });
      }
    } catch (error) {
      setResult({ 
        success: false, 
        message: 'An error occurred while creating sample data.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!user) {
      setResult({ success: false, message: 'Please log in first' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await clearUserData(user.uid);
      if (response.success) {
        setResult({ 
          success: true, 
          message: 'User data cleared successfully!' 
        });
      } else {
        setResult({ 
          success: false, 
          message: 'Failed to clear user data. Please try again.' 
        });
      }
    } catch (error) {
      setResult({ 
        success: false, 
        message: 'An error occurred while clearing data.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Authentication Required</h1>
          <p className="text-muted-foreground">Please log in to access the test data page.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Test Data Management</h1>
          <p className="text-muted-foreground text-lg">
            Create sample data to test the portfolio platform or clear existing data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Sample Data */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Create Sample Data</h2>
            <p className="text-muted-foreground mb-6">
              This will populate your portfolio with sample data including profile information, 
              experience, education, skills, and projects.
            </p>
            <Button
              onClick={handleCreateSampleData}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Creating Sample Data...
                </>
              ) : (
                'Create Sample Data'
              )}
            </Button>
          </Card>

          {/* Clear Data */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Clear User Data</h2>
            <p className="text-muted-foreground mb-6">
              This will remove all your portfolio data. Use this to start fresh or test the platform.
            </p>
            <Button
              onClick={handleClearData}
              disabled={loading}
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Clearing Data...
                </>
              ) : (
                'Clear All Data'
              )}
            </Button>
          </Card>
        </div>

        {/* Result Display */}
        {result && (
          <Card className={`mt-6 p-6 ${
            result.success 
              ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
              : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
          }`}>
            <div className="flex items-center gap-3">
              {result.success ? (
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              )}
              <p className={`font-medium ${
                result.success 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {result.message}
              </p>
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8 p-6">
          <h3 className="text-xl font-bold text-foreground mb-4">Instructions</h3>
          <div className="space-y-3 text-muted-foreground">
            <p>1. <strong>Create Sample Data:</strong> Click the button to populate your portfolio with realistic sample data.</p>
            <p>2. <strong>View Portfolio:</strong> After creating sample data, visit your portfolio at <code className="bg-muted px-2 py-1 rounded">/portfolio/johndoe</code></p>
            <p>3. <strong>Test Features:</strong> Try uploading your own CV, updating profile information, and customizing the theme.</p>
            <p>4. <strong>Clear Data:</strong> Use the clear button to remove all data and start fresh.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
