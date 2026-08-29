import React, { createContext } from 'react';
import axios from 'axios';

const API_URL = 'http://your-backend-url/api';

export const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = React.useState([]);
  const [currentTrip, setCurrentTrip] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/trips`);
      setTrips(response.data.trips);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/trips`, tripData);
      setTrips([...trips, response.data.trip]);
      return response.data.trip;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create trip');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchTripDetails = async (tripId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/trips/${tripId}`);
      setCurrentTrip(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch trip details');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTrip = async (tripId, updateData) => {
    try {
      const response = await axios.put(`${API_URL}/trips/${tripId}`, updateData);
      const updatedTrips = trips.map(trip =>
        trip._id === tripId ? response.data.trip : trip
      );
      setTrips(updatedTrips);
      if (currentTrip && currentTrip._id === tripId) {
        setCurrentTrip(response.data.trip);
      }
      return response.data.trip;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update trip');
      throw err;
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      await axios.delete(`${API_URL}/trips/${tripId}`);
      setTrips(trips.filter(trip => trip._id !== tripId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete trip');
      throw err;
    }
  };

  const joinTrip = async (inviteCode) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/invites/accept/${inviteCode}`);
      setTrips([...trips, response.data.trip]);
      return response.data.trip;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join trip');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTripSummary = async (tripId) => {
    try {
      const response = await axios.get(`${API_URL}/trips/${tripId}/summary`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch trip summary');
      throw err;
    }
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        currentTrip,
        loading,
        error,
        fetchTrips,
        createTrip,
        fetchTripDetails,
        updateTrip,
        deleteTrip,
        joinTrip,
        getTripSummary
      }}
    >
      {children}
    </TripContext.Provider>
  );
};
