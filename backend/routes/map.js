const express = require('express');
const router = express.Router();
const axios = require('axios');
const passport = require('passport');

const authenticate = passport.authenticate('jwt', { session: false });

// Search for locations in India
router.get('/search', authenticate, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Using OpenStreetMap Nominatim API (free)
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query + ', India', // Restrict to India
        format: 'json',
        limit: 10,
        countrycodes: 'IN'
      },
      headers: {
        'User-Agent': 'TravelExpenseApp/1.0'
      }
    });

    const locations = response.data.map(location => ({
      name: location.display_name,
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lon),
      type: location.type,
      importance: location.importance
    }));

    res.json({
      locations,
      count: locations.length
    });
  } catch (error) {
    console.error('Map search error:', error);
    res.status(500).json({ error: 'Failed to search locations' });
  }
});

// Reverse geocoding - get location name from coordinates
router.get('/reverse', authenticate, async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json'
      },
      headers: {
        'User-Agent': 'TravelExpenseApp/1.0'
      }
    });

    const location = {
      name: response.data.display_name,
      latitude: parseFloat(response.data.lat),
      longitude: parseFloat(response.data.lon),
      address: response.data.address
    };

    res.json(location);
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    res.status(500).json({ error: 'Failed to get location information' });
  }
});

// Get popular destinations in India
router.get('/destinations', authenticate, async (req, res) => {
  try {
    const popularDestinations = [
      { name: 'Goa', coordinates: { latitude: 15.4909, longitude: 73.8278 } },
      { name: 'Jaipur', coordinates: { latitude: 26.9124, longitude: 75.7873 } },
      { name: 'Mumbai', coordinates: { latitude: 19.0760, longitude: 72.8777 } },
      { name: 'Delhi', coordinates: { latitude: 28.7041, longitude: 77.1025 } },
      { name: 'Bangalore', coordinates: { latitude: 12.9716, longitude: 77.5946 } },
      { name: 'Kerala Backwaters', coordinates: { latitude: 9.2941, longitude: 76.5224 } },
      { name: 'Agra (Taj Mahal)', coordinates: { latitude: 27.1751, longitude: 78.0421 } },
      { name: 'Udaipur', coordinates: { latitude: 24.5854, longitude: 73.7125 } },
      { name: 'Rishikesh', coordinates: { latitude: 30.0869, longitude: 78.2684 } },
      { name: 'Manali', coordinates: { latitude: 32.2393, longitude: 77.1884 } }
    ];

    res.json({
      destinations: popularDestinations,
      count: popularDestinations.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// Calculate distance between two locations
router.post('/distance', authenticate, async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({ error: 'from and to coordinates are required' });
    }

    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in kilometers
    const dLat = (to.latitude - from.latitude) * Math.PI / 180;
    const dLon = (to.longitude - from.longitude) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(from.latitude * Math.PI / 180) * Math.cos(to.latitude * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    res.json({
      distance: Math.round(distance * 10) / 10,
      unit: 'km'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate distance' });
  }
});

module.exports = router;
