import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('userInfo')) || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (user) {
        try {
          const { data } = await api.get('/auth/me');
          setUser({ ...data, token: user.token });
        } catch (error) {
          localStorage.removeItem('userInfo');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    toast.success(`Welcome back, ${data.name}!`);
    return data; // Return data so callers can redirect based on role
  };

  const register = async (name, email, password, extraData = {}) => {
    const payload = { name, email, password, ...extraData };
    const { data } = await api.post('/auth/register', payload);
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    toast.success(`Welcome to the platform, ${data.name}!`);
  };

  const updateProfile = async (formData) => {
    // using multi-part form data for image upload
    const { data } = await api.put('/auth/me', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    toast.success('Profile updated successfully!');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
