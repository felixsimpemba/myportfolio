'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/AuthContext';
import { uploadFileToPHP } from '@/lib/phpStorage';

export default function TestPHPUploadPage() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    console.log('=== PHP Upload Test ===');
    console.log('File:', file);
    console.log('User:', user);

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const uploadResult = await uploadFileToPHP(file, user.uid, 'cv');
      
      if (!uploadResult.success) {
        setError(uploadResult.error || 'Upload failed');
      } else {
        setResult(uploadResult);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">PHP Upload Test</h1>
        <p className="text-red-600">Please log in to test file uploads.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Test PHP File Upload</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select a file to upload:
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
            onChange={handleFileUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {uploading && (
          <div className="text-blue-600">
            Uploading... Please wait.
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
              <div><strong>URL:</strong> <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{result.url}</a></div>
              <div><strong>Name:</strong> {result.name}</div>
              <div><strong>Size:</strong> {(result.size! / 1024 / 1024).toFixed(2)} MB</div>
              <div><strong>Type:</strong> {result.type}</div>
              <div><strong>Uploaded At:</strong> {result.uploadedAt}</div>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>Upload the PHP files to your web server</li>
            <li>Update the PHP_UPLOAD_ENDPOINT URL in src/lib/phpStorage.ts</li>
            <li>Make sure the uploads directory is writable (chmod 755)</li>
            <li>Test the upload functionality</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
