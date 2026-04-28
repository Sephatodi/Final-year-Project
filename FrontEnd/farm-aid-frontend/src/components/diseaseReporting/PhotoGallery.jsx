import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';

const PhotoGallery = ({ photos, onPhotosChange, maxPhotos = 5 }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const newPhotos = [];
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') && photos.length + newPhotos.length < maxPhotos) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotos.push({
            id: Date.now() + Math.random(),
            data: reader.result,
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

  const handleRemovePhoto = (photoId) => {
    onPhotosChange(photos.filter(p => p.id !== photoId));
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.capture = 'environment';
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Upload Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          icon="upload"
        >
          {t('report.uploadPhotos') || 'Upload Photos'}
        </Button>
        
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleCameraCapture}
          icon="photo_camera"
        >
          {t('report.takePhoto') || 'Take Photo'}
        </Button>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {photos.map((photo, index) => (
            <div key={photo.id} className="relative group aspect-square">
              <img
                src={photo.data}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border-2 border-sage-200 dark:border-sage-800"
              />
              
              {/* Photo Number Badge */}
              <div className="absolute top-2 left-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                {index + 1}
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemovePhoto(photo.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="material-icons-outlined text-sm">close</span>
              </button>

              {/* Photo Info Tooltip */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate">
                {photo.name}
              </div>
            </div>
          ))}

          {/* Add More Placeholder */}
          {photos.length < maxPhotos && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-sage-300 dark:border-sage-700 flex flex-col items-center justify-center gap-2 text-sage-500 hover:border-primary hover:text-primary transition-colors"
            >
              <span className="material-icons-outlined text-3xl">add_photo_alternate</span>
              <span className="text-xs">{t('common.add') || 'Add'}</span>
            </button>
          )}
        </div>
      )}

      {/* Photo Count */}
      <p className="text-xs text-sage-500">
        {photos.length} / {maxPhotos} {t('report.photosUploaded') || 'photos uploaded'}
      </p>

      {/* Photo Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
          <span className="material-icons-outlined text-sm">tips_and_updates</span>
          <span>
            {t('report.photoTips') || 'Take clear photos of affected areas, mouth, feet, and skin. Include a reference object for scale.'}
          </span>
        </p>
      </div>
    </div>
  );
};

PhotoGallery.propTypes = {
  photos: PropTypes.array,
  onPhotosChange: PropTypes.func.isRequired,
  maxPhotos: PropTypes.number,
};

export default PhotoGallery;