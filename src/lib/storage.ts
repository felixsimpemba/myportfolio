import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  getMetadata,
  updateMetadata
} from 'firebase/storage';
import { storage } from './firebase';

// File upload utility
export const uploadFile = async (
  file: File, 
  path: string, 
  metadata?: { [key: string]: any }
) => {
  try {
    console.log('Storage instance:', storage);
    console.log('Upload path:', path);
    console.log('File to upload:', file);
    
    const storageRef = ref(storage, path);
    console.log('Storage ref created:', storageRef);
    
    // Add metadata for better file handling
    const uploadMetadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        ...metadata
      }
    };
    
    console.log('Starting upload with metadata:', uploadMetadata);
    const uploadResult = await uploadBytes(storageRef, file, uploadMetadata);
    console.log('Upload completed:', uploadResult);
    
    const downloadURL = await getDownloadURL(uploadResult.ref);
    console.log('Download URL obtained:', downloadURL);
    
    return {
      url: downloadURL,
      path: path,
      name: file.name,
      size: file.size,
      type: file.type,
      error: null
    };
  } catch (error: any) {
    console.error('Upload error details:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return {
      url: null,
      path: null,
      name: null,
      size: null,
      type: null,
      error: error.message || 'Upload failed'
    };
  }
};

// Delete file utility
export const deleteFile = async (path: string) => {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get file metadata
export const getFileMetadata = async (path: string) => {
  try {
    const fileRef = ref(storage, path);
    const metadata = await getMetadata(fileRef);
    return { metadata, error: null };
  } catch (error: any) {
    return { metadata: null, error: error.message };
  }
};

// Update file metadata
export const updateFileMetadata = async (path: string, metadata: { [key: string]: any }) => {
  try {
    const fileRef = ref(storage, path);
    await updateMetadata(fileRef, metadata);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Generate unique file path
export const generateFilePath = (userId: string, type: 'profile' | 'cv' | 'portfolio' | 'other', fileName: string) => {
  const timestamp = Date.now();
  const extension = fileName.split('.').pop();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `users/${userId}/${type}/${timestamp}_${sanitizedFileName}`;
};

// Validate file type
export const validateFileType = (file: File, allowedTypes: string[]) => {
  return allowedTypes.includes(file.type);
};

// Validate file size
export const validateFileSize = (file: File, maxSizeInMB: number) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

// Compress image
export const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(compressedFile);
        } else {
          resolve(file);
        }
      }, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};
