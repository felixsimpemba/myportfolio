'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/AuthContext';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function TestStoragePage() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testStorageConnection = async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      console.log('=== Storage Connection Test ===');
      console.log('Storage instance:', storage);
      console.log('User:', user.uid);

      // Create a simple text file
      const testContent = 'This is a test file for Firebase Storage';
      const testFile = new File([testContent], 'test.txt', { type: 'text/plain' });
      
      console.log('Test file created:', testFile);

      // Create storage reference
      const testPath = `users/${user.uid}/test/test-${Date.now()}.txt`;
      const storageRef = ref(storage, testPath);
      
      console.log('Storage ref:', storageRef);
      console.log('Test path:', testPath);

      // Upload file
      console.log('Starting upload...');
      const uploadResult = await uploadBytes(storageRef, testFile);
      console.log('Upload result:', uploadResult);

      // Get download URL
      console.log('Getting download URL...');
      const downloadURL = await getDownloadURL(uploadResult.ref);
      console.log('Download URL:', downloadURL);

      setResult({
        success: true,
        downloadURL,
        path: testPath,
        message: 'Storage connection successful!'
      });

    } catch (err: any) {
      console.error('Storage test error:', err);
      setError(`Storage test failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Storage Connection Test</h1>
        <p className="text-red-600">Please log in to test storage connection.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Firebase Storage Connection Test</h1>
      
      <div className="space-y-4">
        <Button 
          onClick={testStorageConnection}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? 'Testing...' : 'Test Storage Connection'}
        </Button>

        {uploading && (
          <div className="text-blue-600">
            Testing storage connection... Check console for details.
          </div>
        )}

        {error && (
          <div className="text-red-600 bg-red-50 p-4 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="text-green-600 bg-green-50 p-4 rounded-lg">
            <strong>Success!</strong>
            <div className="mt-2 space-y-1 text-sm">
              <div><strong>Message:</strong> {result.message}</div>
              <div><strong>Path:</strong> {result.path}</div>
              <div><strong>URL:</strong> <a href={result.downloadURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Open File</a></div>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Information:</h3>
          <div className="text-sm space-y-1">
            <div><strong>User ID:</strong> {user.uid}</div>
            <div><strong>User Email:</strong> {user.email}</div>
            <div><strong>Storage Bucket:</strong> feltech-347cc.firebasestorage.app</div>
          </div>
        </div>
      </div>
    </div>
  );
}
