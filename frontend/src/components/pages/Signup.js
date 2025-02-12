import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For redirecting
import { toast } from 'react-toastify'; // For success messages
import 'react-toastify/dist/ReactToastify.css';
import '../styles/pages/signup.css'

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        telephone_no: '',
        password: '',
        password_confirmation: ''
    });

    const [message, setMessage] = useState(''); // For success/error messages
    const [error, setError] = useState(false); // To track if the message is an error

    const navigate = useNavigate(); // React Router navigation hook

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/signup/', formData);
            setMessage('Registration successful! You can now log in.');
            setError(false); // Mark the message as a success
            toast.success('Registration successful! You can now log in.');

            // Redirect to login page after successful signup
            navigate('/login');
        } catch (error) {
            const errorMessage =
                error.response?.data?.detail || 'An error occurred. Please try again.';
            setMessage(errorMessage);
            setError(true); // Mark the message as an error
            toast.error(errorMessage); // Show error toast
        }
    };

    return (
        <div className='signup'>
            <h1>Sign Up</h1>
            {message && (
                <p>
                    {message}
                </p>
            )}
            <form className='form-signup' onSubmit={handleSubmit}>
                <input
                    name="username"
                    onChange={handleChange}
                    placeholder="Username"
                    required
                    className='input-signup'
                />
                <br />
                <input
                    name="first_name"
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                    className='input-signup'
                />
                <br />
                <input
                    name="last_name"
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                    className='input-signup'
                />
                <br />
                <input
                    name="email"
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className='input-signup'
                />
                <br />
                <input
                    name="telephone_no"
                    onChange={handleChange}
                    placeholder="Telephone No"
                    required
                    className='input-signup'
                />
                <br />
                <input
                    name="password"
                    type="password"
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className='input-signup'
                />
                <br />
                <input
                    name="password_confirmation"
                    type="password"
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required
                    className='input-signup'
                />
                <br />
                <button className='signup-btn' type="submit">Sign Up</button>
            </form>
            <p>Don't have an account <a href='/Login'>Login</a></p>
        </div>
    );
};

export default Signup;
