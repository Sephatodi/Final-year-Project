// Calculate distance between two points (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Convert degrees to radians
export const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

// Convert radians to degrees
export const toDeg = (radians) => {
  return radians * (180 / Math.PI);
};

// Check if point is within radius of center
export const isWithinRadius = (lat1, lon1, lat2, lon2, radius) => {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  return distance <= radius;
};

// Get bounding box from center and radius
export const getBoundingBox = (lat, lng, radius) => {
  const latChange = radius / 111.32; // 1 degree lat = 111.32 km
  const lngChange = radius / (111.32 * Math.cos(toRad(lat)));

  return {
    minLat: lat - latChange,
    maxLat: lat + latChange,
    minLng: lng - lngChange,
    maxLng: lng + lngChange,
  };
};

// Calculate bearing between two points
export const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  
  let bearing = toDeg(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;
  
  return bearing;
};

// Get compass direction from bearing
export const getDirection = (bearing) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(bearing / 22.5) % 16;
  return directions[index];
};

// Format coordinates for display
export const formatCoordinates = (lat, lng, format = 'dms') => {
  if (format === 'dms') {
    return `${formatDMS(lat, 'lat')} ${formatDMS(lng, 'lng')}`;
  }
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};

// Format DMS (Degrees Minutes Seconds)
export const formatDMS = (coord, type) => {
  const absolute = Math.abs(coord);
  const degrees = Math.floor(absolute);
  const minutes = Math.floor((absolute - degrees) * 60);
  const seconds = ((absolute - degrees - minutes / 60) * 3600).toFixed(2);
  
  const direction = type === 'lat'
    ? coord >= 0 ? 'N' : 'S'
    : coord >= 0 ? 'E' : 'W';
  
  return `${degrees}°${minutes}'${seconds}"${direction}`;
};

// Parse DMS to decimal
export const parseDMS = (dms) => {
  const parts = dms.split(/[°'"]/);
  if (parts.length < 3) return null;
  
  const degrees = parseFloat(parts[0]);
  const minutes = parseFloat(parts[1]);
  const seconds = parseFloat(parts[2]);
  const direction = parts[3]?.trim() || '';
  
  let decimal = degrees + minutes / 60 + seconds / 3600;
  
  if (direction === 'S' || direction === 'W') {
    decimal = -decimal;
  }
  
  return decimal;
};

// Calculate midpoint between two points
export const calculateMidpoint = (lat1, lon1, lat2, lon2) => {
  const dLon = toRad(lon2 - lon1);
  
  const x = Math.cos(toRad(lat2)) * Math.cos(dLon);
  const y = Math.cos(toRad(lat2)) * Math.sin(dLon);
  
  const lat3 = Math.atan2(
    Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)),
    Math.sqrt((Math.cos(toRad(lat1)) + x) ** 2 + y ** 2)
  );
  
  const lon3 = toRad(lon1) + Math.atan2(y, Math.cos(toRad(lat1)) + x);
  
  return {
    lat: toDeg(lat3),
    lng: toDeg(lon3),
  };
};

// Check if point is in polygon (ray casting algorithm)
export const pointInPolygon = (point, polygon) => {
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    
    const intersect = ((yi > point[1]) !== (yj > point[1])) &&
      (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
};

// Calculate polygon area (shoelace formula)
export const calculatePolygonArea = (polygon) => {
  let area = 0;
  
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    area += polygon[i][0] * polygon[j][1];
    area -= polygon[j][0] * polygon[i][1];
  }
  
  return Math.abs(area) / 2;
};

// Simplify polygon (Douglas-Peucker algorithm)
export const simplifyPolygon = (points, tolerance) => {
  if (points.length <= 2) return points;
  
  const findPerpendicularDistance = (p, p1, p2) => {
    const x0 = p[0], y0 = p[1];
    const x1 = p1[0], y1 = p1[1];
    const x2 = p2[0], y2 = p2[1];
    
    const numerator = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1);
    const denominator = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
    
    return numerator / denominator;
  };
  
  let maxDistance = 0;
  let maxIndex = 0;
  
  for (let i = 1; i < points.length - 1; i++) {
    const distance = findPerpendicularDistance(points[i], points[0], points[points.length - 1]);
    
    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = i;
    }
  }
  
  if (maxDistance > tolerance) {
    const left = simplifyPolygon(points.slice(0, maxIndex + 1), tolerance);
    const right = simplifyPolygon(points.slice(maxIndex), tolerance);
    
    return [...left.slice(0, -1), ...right];
  }
  
  return [points[0], points[points.length - 1]];
};

// Convert GeoJSON to coordinates
export const geojsonToCoords = (geojson) => {
  if (geojson.type === 'Point') {
    return geojson.coordinates;
  }
  
  if (geojson.type === 'Polygon') {
    return geojson.coordinates[0];
  }
  
  return [];
};

// Convert coordinates to GeoJSON
export const coordsToGeojson = (coords, type = 'Point') => {
  if (type === 'Point') {
    return {
      type: 'Point',
      coordinates: coords,
    };
  }
  
  if (type === 'Polygon') {
    return {
      type: 'Polygon',
      coordinates: [coords],
    };
  }
  
  return null;
};

// Get address from coordinates (reverse geocoding)
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.display_name;
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return null;
  }
};

// Get coordinates from address (geocoding)
export const geocode = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding failed:', error);
    return null;
  }
};