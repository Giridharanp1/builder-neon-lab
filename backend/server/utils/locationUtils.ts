/**
 * Calculate distance between two points using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Validate coordinates
 * @param lat Latitude
 * @param lon Longitude
 * @returns Boolean indicating if coordinates are valid
 */
export const isValidCoordinates = (lat: number, lon: number): boolean => {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};

/**
 * Create a geospatial query for MongoDB
 * @param lat Latitude
 * @param lon Longitude
 * @param maxDistance Maximum distance in kilometers
 * @returns MongoDB geospatial query object
 */
export const createNearQuery = (lat: number, lon: number, maxDistance: number = 50) => {
  return {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lon, lat] // MongoDB uses [longitude, latitude] order
        },
        $maxDistance: maxDistance * 1000 // Convert to meters
      }
    }
  };
};

/**
 * Convert address to coordinates (mock function - in production, use Google Maps API or similar)
 * @param address Address string
 * @returns Promise with coordinates
 */
export const geocodeAddress = async (address: string): Promise<{ lat: number; lon: number }> => {
  // This is a mock implementation
  // In production, you would use Google Maps Geocoding API or similar
  const mockCoordinates: { [key: string]: { lat: number; lon: number } } = {
    'chennai': { lat: 13.0827, lon: 80.2707 },
    'mumbai': { lat: 19.0760, lon: 72.8777 },
    'delhi': { lat: 28.7041, lon: 77.1025 },
    'bangalore': { lat: 12.9716, lon: 77.5946 },
    'kolkata': { lat: 22.5726, lon: 88.3639 },
    'hyderabad': { lat: 17.3850, lon: 78.4867 },
    'pune': { lat: 18.5204, lon: 73.8567 },
    'ahmedabad': { lat: 23.0225, lon: 72.5714 }
  };

  const lowerAddress = address.toLowerCase();
  for (const [city, coords] of Object.entries(mockCoordinates)) {
    if (lowerAddress.includes(city)) {
      return coords;
    }
  }

  // Default to Chennai if no match found
  return { lat: 13.0827, lon: 80.2707 };
}; 