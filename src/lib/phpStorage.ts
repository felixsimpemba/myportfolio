// PHP File Upload Service
const PHP_UPLOAD_ENDPOINT = 'https://mentalhealthplatform.org/myportfolioCV/upload.php';

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  name?: string;
  size?: number;
  type?: string;
  uploadedAt?: string;
  error?: string;
}

export const uploadFileToPHP = async (
  file: File,
  userId: string,
  fileType: 'profile' | 'cv' | 'project' | 'other' = 'other'
): Promise<UploadResult> => {
  try {
    console.log('Uploading to PHP endpoint:', PHP_UPLOAD_ENDPOINT);
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('fileType', fileType);

    // Upload file
    const response = await fetch(PHP_UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Upload failed');
    }

    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }

    console.log('Upload successful:', result);
    return {
      success: true,
      url: result.url,
      path: result.path,
      name: result.name,
      size: result.size,
      type: result.type,
      uploadedAt: result.uploadedAt,
      error: undefined
    };

  } catch (error: any) {
    console.error('PHP upload error:', error);
    return {
      success: false,
      url: undefined,
      path: undefined,
      name: undefined,
      size: undefined,
      type: undefined,
      uploadedAt: undefined,
      error: error.message || 'Upload failed'
    };
  }
};

export const deleteFileFromPHP = async (
  filePath: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // You'll need to create a delete.php endpoint for this
    const response = await fetch(`${PHP_UPLOAD_ENDPOINT.replace('upload.php', 'delete.php')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filePath })
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getFileListFromPHP = async (
  userId: string,
  fileType?: string
): Promise<{ files: any[]; error?: string }> => {
  try {
    const url = `${PHP_UPLOAD_ENDPOINT.replace('upload.php', 'file-manager.php')}?userId=${userId}${fileType ? `&fileType=${fileType}` : ''}`;
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (error: any) {
    return { files: [], error: error.message };
  }
};

