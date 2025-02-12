import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages/login.css';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Use JWT endpoint (changed from api-token-auth/ to api/token/)
            const response = await axios.post('http://localhost:8000/api/token/', {
                email: credentials.email,
                password: credentials.password
            });
            
            // 2. JWT returns access/refresh tokens (not just 'token')
            const { access, refresh } = response.data;
            
            // 3. Store both tokens
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            
            // 4. Use JWT Bearer authentication
            const userResponse = await axios.get('http://localhost:8000/api/current-user/', {
                headers: { 
                    Authorization: `Bearer ${access}`  // Changed to Bearer
                }
            });
            
            // 5. Update auth context with both tokens
            login({
                ...userResponse.data,
                accessToken: access,
                refreshToken: refresh
            });
            
            navigate(`/profile/${userResponse.data.username}`);
        } catch (error) {
            // Handle JWT-specific error format
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.message ||
                               'Login failed. Please check your credentials';
            setMessage(errorMessage);
            setError(true);
            console.error('Login error:', error.response?.data);
        }
    };

    return (
        <div className='login'>
            <h1 className='h1-login'>Login</h1>
            {message && (
                <p className={error ? 'error-message' : 'success-message'}>
                    {message}
                </p>
            )}
            <form className='form-login' onSubmit={handleSubmit}>
                <input
                    name="email"  
                    type="email"
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className='input-login'
                    value={credentials.email}
                />
                <br />
                <input
                    name="password"
                    type="password"
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className='input-login'
                    value={credentials.password}
                />
                <br />
                <button className='login-btn' type="submit">Login</button>
            </form>
            <p className='login-link'>
                Don't have an account? <a className='login-link-2' href='/signup'>Sign up</a>
            </p>
        </div>
    );
};

export default Login;