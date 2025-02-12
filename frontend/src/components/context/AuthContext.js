import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (userData, accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        setUser({ ...userData, accessToken });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    const refreshToken = async () => {
        try {
            const refresh = localStorage.getItem('refresh_token');
            if (!refresh) throw new Error("No refresh token found");

            const response = await axios.post('http://localhost:8000/api/token/refresh/', { refresh });
            localStorage.setItem('access_token', response.data.access);
            return response.data.access;
        } catch (error) {
            logout();
            throw error;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    // Verify token validity
                    await axios.post('http://localhost:8000/api/token/verify/', { token });

                    // Get fresh user data
                    const userResponse = await axios.get(
                        'http://localhost:8000/api/current-user/', 
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    setUser({ ...userResponse.data, accessToken: token });
                } catch (error) {
                    console.error('Authentication check failed:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    // Add Axios interceptor for token refresh
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const newToken = await refreshToken();
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        return axios(originalRequest);
                    } catch (refreshError) {
                        logout();
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);