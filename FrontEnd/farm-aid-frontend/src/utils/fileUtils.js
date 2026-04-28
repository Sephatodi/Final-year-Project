import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from './constants';

// Read file as data URL
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

// Read file as text
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

// Read file as ArrayBuffer
export const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Validate file
export const validateFile = (file, allowedTypes = ALLOWED_IMAGE_TYPES, maxSize = MAX_FILE_SIZE) => {
  const errors = [];

  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }

  if (file.size > maxSize) {
    errors.push(`File size exceeds ${maxSize / 1024 / 1024}MB`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Get file extension
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Get file name without extension
export const getFileNameWithoutExtension = (filename) => {
  return filename.substring(0, filename.lastIndexOf('.')) || filename;
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate unique filename
export const generateUniqueFilename = (originalName) => {
  const extension = getFileExtension(originalName);
  const name = getFileNameWithoutExtension(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  return `${name}-${timestamp}-${random}.${extension}`;
};

// Download file
export const downloadFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Download from URL
export const downloadFromUrl = async (url, filename) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    downloadFile(blob, filename, response.headers.get('content-type'));
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

// Convert base64 to blob
export const base64ToBlob = (base64, type = 'application/octet-stream') => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type });
};

// Convert blob to base64
export const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to convert blob to base64'));
    };
    
    reader.readAsDataURL(blob);
  });
};

// Convert file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to convert file to base64'));
    };
    
    reader.readAsDataURL(file);
  });
};

// Create object URL
export const createObjectUrl = (blob) => {
  return URL.createObjectURL(blob);
};

// Revoke object URL
export const revokeObjectUrl = (url) => {
  URL.revokeObjectURL(url);
};

// Check if file is image
export const isImageFile = (file) => {
  return file.type.startsWith('image/');
};

// Check if file is video
export const isVideoFile = (file) => {
  return file.type.startsWith('video/');
};

// Check if file is audio
export const isAudioFile = (file) => {
  return file.type.startsWith('audio/');
};

// Check if file is PDF
export const isPdfFile = (file) => {
  return file.type === 'application/pdf';
};

// Check if file is document
export const isDocumentFile = (file) => {
  const docTypes = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ];
  return docTypes.includes(file.type);
};