import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import Card from '../common/Card';

const PhotoUpload = ({ photos = [], onPhotosChange, maxPhotos = 5 }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files) => {
    const newPhotos = [];
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') && photos.length + newPhotos.length < maxPhotos) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotos.push({
            id: Date.now() + Math.random(),
            file: reader.result,
            name: file.name,
            size: file.size
          });
          
          if (newPhotos.length === files.length) {
            onPhotosChange([...photos, ...newPhotos]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleRemovePhoto = (photoId) => {
    onPhotosChange(photos.filter(p => p.id !== photoId));
  };

  const handleCameraCapture = () => {
    // In a real app, this would open the camera
    if (fileInputRef.current) {
      fileInputRef.current.capture = 'environment';
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-sage-900 dark:text-white mb-2">
          {t('symptomChecker.addPhotos') || 'Add Photos'}
        </h3>
        <p className="text-sm text-sage-500">
          {t('symptomChecker.photosSubtitle') || 'Photos help AI provide better diagnosis (optional)'}
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-sage-300 dark:border-sage-700 hover:border-primary/50'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        <div className="text-center">
          <span className="material-icons-outlined text-5xl text-sage-400 mb-3">
            {isDragging ? 'cloud_upload' : 'add_photo_alternate'}
          </span>
          
          <p className="text-sm text-sage-600 dark:text-sage-400 mb-2">
            {isDragging
              ? t('symptomChecker.dropHere') || 'Drop photos here'
              : t('symptomChecker.dragDrop') || 'Drag & drop photos or click to browse'
            }
          </p>
          
          <p className="text-xs text-sage-500 mb-4">
            {t('symptomChecker.photoLimit') || `Up to ${maxPhotos} photos`} • JPG, PNG
          </p>

          <div className="flex gap-3 justify-center">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              icon="upload"
            >
              {t('common.browse') || 'Browse'}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCameraCapture}
              icon="photo_camera"
            >
              {t('common.camera') || 'Camera'}
            </Button>
          </div>
        </div>

        {/* Photo count */}
        <div className="absolute top-2 right-2 text-xs text-sage-500">
          {photos.length}/{maxPhotos}
        </div>
      </div>

      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
          {photos.map((photo, index) => (
            <div key={photo.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-sage-100 dark:bg-sage-800">
                <img
                  src={photo.file}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <button
                onClick={() => handleRemovePhoto(photo.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="material-icons-outlined text-sm">close</span>
              </button>

              {/* Photo order indicator */}
              <div className="absolute bottom-2 left-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                {index + 1}
              </div>
            </div>
          ))}

          {/* Add more placeholder */}
          {photos.length < maxPhotos && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-sage-300 dark:border-sage-700 flex flex-col items-center justify-center gap-2 text-sage-500 hover:border-primary hover:text-primary transition-colors"
            >
              <span className="material-icons-outlined">add</span>
              <span className="text-xs">{t('common.add') || 'Add'}</span>
            </button>
          )}
        </div>
      )}

      {/* AI Analysis Note */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="material-icons-outlined text-sm text-blue-600">info</span>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            {t('symptomChecker.photoNote') || 'Photos are analyzed locally on your device and are not uploaded to the cloud. This works offline and protects your privacy.'}
          </p>
        </div>
      </div>
    </div>
  );
};

PhotoUpload.propTypes = {
  photos: PropTypes.array,
  onPhotosChange: PropTypes.func.isRequired,
  maxPhotos: PropTypes.number,
};

export default PhotoUpload;