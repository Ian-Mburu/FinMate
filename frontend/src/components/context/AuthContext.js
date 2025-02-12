// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const response = await axios.get(
                        'http://localhost:8000/api/current-user/', 
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setUser(response.data);
                } catch (error) {
                    console.error('Authentication check failed:', error);
                    logout();
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('access_token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    const refreshToken = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                refresh: localStorage.getItem('refresh_token')
            });
            localStorage.setItem('access_token', response.data.access);
            return response.data.access;
        } catch (error) {
            logout();
            throw error;
        }
    };

    // Add axios interceptor for token refresh
    axios.interceptors.response.use(
        response => response,
        async error => {
            const originalRequest = error.config;
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                const newToken = await refreshToken();
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return axios(originalRequest);
            }
            return Promise.reject(error);
        }
    );

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);