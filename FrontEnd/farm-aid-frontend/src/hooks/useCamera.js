import { useRef, useState } from 'react';

export const useCamera = (options = {}) => {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);

  const {
    facingMode = 'environment', // 'user' for front camera
    width = 1280,
    height = 720,
    quality = 0.8
  } = options;

  const startCamera = async () => {
    setLoading(true);
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: width },
          height: { ideal: height }
        }
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      return mediaStream;
    } catch (err) {
      let errorMessage;

      switch (err.name) {
        case 'NotAllowedError':
          errorMessage = 'Camera permission denied';
          break;
        case 'NotFoundError':
          errorMessage = 'No camera found on this device';
          break;
        case 'NotReadableError':
          errorMessage = 'Camera is already in use';
          break;
        default:
          errorMessage = 'Failed to access camera';
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const switchCamera = async () => {
    stopCamera();
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    return startCamera({ ...options, facingMode: newFacingMode });
  };

  const captureImage = () => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current || !stream) {
        reject('Camera not initialized');
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          const imageUrl = URL.createObjectURL(blob);
          const imageData = {
            blob,
            url: imageUrl,
            width: canvas.width,
            height: canvas.height,
            timestamp: Date.now()
          };
          setCapturedImage(imageData);
          resolve(imageData);
        },
        'image/jpeg',
        quality
      );
    });
  };

  const takePhoto = async () => {
    try {
      if (!stream) {
        await startCamera();
      }
      return await captureImage();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
  };

  const compressImage = async (imageBlob, maxSize = 1024 * 1024) => {
    if (imageBlob.size <= maxSize) {
      return imageBlob;
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(imageBlob);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > 1024) {
            height = Math.round((height * 1024) / width);
            width = 1024;
          }
        } else {
          if (height > 1024) {
            width = Math.round((width * 1024) / height);
            height = 1024;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (compressedBlob) => {
            resolve(compressedBlob);
          },
          'image/jpeg',
          0.8
        );
      };
    });
  };

  return {
    videoRef,
    stream,
    error,
    loading,
    capturedImage,
    startCamera,
    stopCamera,
    switchCamera,
    takePhoto,
    resetCapture,
    compressImage,
    isCameraActive: !!stream
  };
};