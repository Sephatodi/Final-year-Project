import PropTypes from 'prop-types';
import { useState } from 'react';

const ImageGallery = ({ images, onImageClick, columns = 3, lightbox = false }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleImageClick = (image, index) => {
    if (lightbox) {
      setSelectedImage(image);
      setLightboxOpen(true);
    }
    if (onImageClick) {
      onImageClick(image, index);
    }
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  const handleNext = () => {
    const currentIndex = images.findIndex(img => img.id === selectedImage?.id);
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = images.findIndex(img => img.id === selectedImage?.id);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  return (
    <>
      {/* Image Grid */}
      <div className={`grid ${gridCols[columns]} gap-4`}>
        {images.map((image, index) => (
          <div
            key={image.id || index}
            className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
            onClick={() => handleImageClick(image, index)}
          >
            <img
              src={image.url || image}
              alt={image.alt || `Image ${index + 1}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="material-icons-outlined text-white text-3xl">
                zoom_in
              </span>
            </div>

            {/* Caption */}
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white text-sm">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={handleCloseLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
          >
            <span className="material-icons-outlined text-3xl">close</span>
          </button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 text-white/70 hover:text-white"
              >
                <span className="material-icons-outlined text-4xl">chevron_left</span>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 text-white/70 hover:text-white"
              >
                <span className="material-icons-outlined text-4xl">chevron_right</span>
              </button>
            </>
          )}

          {/* Image */}
          <div className="max-w-7xl max-h-[90vh] p-4">
            <img
              src={selectedImage.url || selectedImage}
              alt={selectedImage.alt || 'Lightbox'}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Image Info */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              <p className="text-sm">
                {images.findIndex(img => img.id === selectedImage.id) + 1} / {images.length}
                {selectedImage.caption && ` • ${selectedImage.caption}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        url: PropTypes.string.isRequired,
        alt: PropTypes.string,
        caption: PropTypes.string,
      }),
    ])
  ).isRequired,
  onImageClick: PropTypes.func,
  columns: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  lightbox: PropTypes.bool,
};

export default ImageGallery;