import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/pages/wishlist.css';

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // WishlistPage.jsx
useEffect(() => {
    const fetchWishlist = async () => {
        try {
            const response = await axios.get('/api/wishlist/', {
                headers: { Authorization: `Bearer ${user.access}` }
            });
            // Verify response structure
            console.log('Wishlist API response:', response.data);
            setWishlist(response.data?.products || []);
            setLoading(false);
        } catch (error) {
            console.error('Wishlist fetch error:', error);
            if (error.response?.status === 401) {
                logout();
                navigate('/login');
            }
            setLoading(false);
        }
    };

    if (user) fetchWishlist();
}, [user]);

    const removeFromWishlist = async (productId) => {
        try {
            await axios.delete(`/api/wishlist/remove_product/${productId}/`, {
                headers: { Authorization: `Bearer ${user.access}` }
            });
            setWishlist(wishlist.filter(product => product.id !== productId));
        } catch (error) {
            console.error('Remove from wishlist failed:', error);
        }
    };

    if (loading) return <div className="loading">Loading wishlist...</div>;

    return (
        <div className="wishlist-container">
            <h2>Your Wishlist</h2>
            {wishlist.length === 0 ? (
                <p className="empty-wishlist">Your wishlist is empty</p>
            ) : (
                <div className="wishlist-items">
                    {wishlist.map(product => (
                        <div key={product.id} className="wishlist-item">
                            <Link to={`/products/${product.id}`}>
                                <img src={product.image} alt={product.title} />
                                <h3>{product.title}</h3>
                                <p>${product.price}</p>
                            </Link>
                            <div className="wishlist-actions">
                                <button
                                    className="remove-btn"
                                    onClick={() => removeFromWishlist(product.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;