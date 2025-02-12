import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios'; // Added axios import
import '../styles/pages/updateProfile.css';

const UpdateProfile = ({ user, onUpdate }) => { // Added onUpdate prop
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: '',
        telephone_no: '',
        avatar: null,
    });

    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null); // Added preview state

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                bio: user.bio || '',
                telephone_no: user.telephone_no || '',
                avatar: user.avatar
            });
            setAvatarPreview(user.avatar); // Initialize preview
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, avatar: file }));
            setAvatarPreview(URL.createObjectURL(file)); // Create preview URL
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formPayload = new FormData();
        // Append all form fields
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formPayload.append(key, value);
            }
        });

        try {
            const response = await axios.put(
                'http://localhost:8000/api/user/update/',
                formPayload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.status === 200) {
                toast.success('Profile updated successfully!');
                if (onUpdate) {
                    onUpdate(response.data); // Notify parent component
                }
            }
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 
                              error.response?.data?.message || 
                              'Update failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="update-profile-form">
            <label>
                Username:
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Email:
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Bio:
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    maxLength="500"
                />
            </label>

            <label>
                Telephone:
                <input
                    type="tel"
                    name="telephone_no"
                    value={formData.telephone_no}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                />
            </label>

            <label>
                Avatar:
                <input 
                    type="file" 
                    name="avatar" 
                    onChange={handleFileChange}
                    accept="image/*"
                />
                {avatarPreview && (
                    <img 
                        src={typeof avatarPreview === 'string' ? 
                            `http://localhost:8000${avatarPreview}` : 
                            avatarPreview} 
                        alt="Avatar preview" 
                        className="avatar-preview"
                    />
                )}
            </label>

            <button type="submit" disabled={loading} className="update-button">
                {loading ? 'Updating...' : 'Update Profile'}
            </button>
        </form>
    );
};

export default UpdateProfile;