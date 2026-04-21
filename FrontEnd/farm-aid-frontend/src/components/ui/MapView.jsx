import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

// Note: This is a simplified map component. In production, integrate with Leaflet or Mapbox
const MapView = ({ 
  center = { lat: -24.6282, lng: 25.9231 }, // Botswana coordinates
  zoom = 7,
  markers = [],
  onMarkerClick,
  height = '400px',
  interactive = true,
  showControls = true,
  className = '' 
}) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    setTimeout(() => setMapLoaded(true), 1000);
  }, []);

  const handleMarkerClick = (marker) => {
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  };

  return (
    <div 
      className={`relative bg-sage-100 dark:bg-sage-800 rounded-lg overflow-hidden ${className}`}
      style={{ height }}
      ref={mapRef}
    >
      {!mapLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sage-500">Loading map...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Mock Map Grid */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />

          {/* Map Controls */}
          {showControls && interactive && (
            <div className="absolute top-4 right-4 bg-white dark:bg-sage-900 rounded-lg shadow-lg border border-sage-200 dark:border-sage-800 overflow-hidden">
              <button className="p-2 hover:bg-sage-100 dark:hover:bg-sage-800 border-b border-sage-200 dark:border-sage-800">
                <span className="material-icons-outlined text-sm">add</span>
              </button>
              <button className="p-2 hover:bg-sage-100 dark:hover:bg-sage-800">
                <span className="material-icons-outlined text-sm">remove</span>
              </button>
            </div>
          )}

          {/* Center Marker */}
          <div
            className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: '50%',
              top: '50%',
            }}
          >
            <div className="relative">
              <div className="w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse" />
              <div className="absolute top-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-primary text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                Center
              </div>
            </div>
          </div>

          {/* Custom Markers */}
          {markers.map((marker, index) => (
            <div
              key={marker.id || index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${marker.x || 50}%`,
                top: `${marker.y || 50}%`,
              }}
              onClick={() => handleMarkerClick(marker)}
            >
              <div className="relative">
                <div className={`w-5 h-5 rounded-full border-2 border-white shadow-lg ${
                  marker.type === 'danger' ? 'bg-red-500' :
                  marker.type === 'warning' ? 'bg-amber-500' :
                  marker.type === 'info' ? 'bg-blue-500' :
                  'bg-primary'
                }`} />
                
                {/* Marker Label */}
                {marker.label && (
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-sage-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {marker.label}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Scale Bar */}
          <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-sage-900/90 px-3 py-1.5 rounded-lg text-xs shadow">
            <div className="flex items-center gap-2">
              <div className="w-16 h-0.5 bg-sage-900 dark:bg-white"></div>
              <span>50 km</span>
            </div>
          </div>

          {/* Attribution */}
          <div className="absolute bottom-4 right-4 text-xs text-sage-500">
            © Farm-Aid Maps
          </div>
        </>
      )}
    </div>
  );
};

MapView.propTypes = {
  center: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  zoom: PropTypes.number,
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      x: PropTypes.number,
      y: PropTypes.number,
      label: PropTypes.string,
      type: PropTypes.oneOf(['default', 'danger', 'warning', 'info']),
    })
  ),
  onMarkerClick: PropTypes.func,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  interactive: PropTypes.bool,
  showControls: PropTypes.bool,
  className: PropTypes.string,
};

export default MapView;