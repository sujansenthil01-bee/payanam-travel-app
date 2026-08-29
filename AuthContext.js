import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('payanam_token');
      const savedUser = await AsyncStorage.getItem('payanam_user');
      if (token && savedUser) setUser(JSON.parse(savedUser));
      setLoading(false);
    })();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('payanam_token', data.token);
    await AsyncStorage.setItem('payanam_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const signup = async (name, email, password) => {
    const { data } = await api.post('/auth/signup', { name, email, password });
    await AsyncStorage.setItem('payanam_token', data.token);
    await AsyncStorage.setItem('payanam_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const loginWithGoogle = async (idToken) => {
    const { data } = await api.post('/auth/google', { idToken });
    await AsyncStorage.setItem('payanam_token', data.token);
    await AsyncStorage.setItem('payanam_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['payanam_token', 'payanam_user']);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
