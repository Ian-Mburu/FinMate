import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/pages/wishlist.css';

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, loading: authLoading, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                console.log("Fetching wishlist with token:", user.accessToken); // Debug log
                const response = await axios.get('http://localhost:8000/api/wishlist/mine/', {
                    headers: { 
                        Authorization: `Bearer ${user.accessToken}`
                    }
                });
                
                const wishlistData = response.data?.products || [];
                setWishlist(wishlistData);
                setLoading(false);
            } catch (error) {
                console.error('Wishlist fetch error:', error);
                if (error.response?.status === 401) {
                    console.log("Unauthorized access, logging out..."); // Debug log
                    logout();
                }
                setLoading(false);
            }
        };
    
        if (!authLoading) {
            if (user?.accessToken) {
                fetchWishlist();
            } else {
                console.log("User  not authenticated, redirecting to login..."); // Debug log
                navigate('/login');
            }
        }
    }, [user, authLoading, navigate, logout]);

    if (authLoading) return <div className="loading">Checking authentication...</div>;
    if (loading) return <div className="loading">Loading wishlist...</div>;


    const removeFromWishlist = async (productId) => {
        try {
            await axios.delete(`http://localhost:8000/api/wishlist/remove_product/${productId}/`, {
                headers: { 
                    Authorization: `Bearer ${user.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            // Refresh the wishlist after removal
            const response = await axios.get('http://localhost:8000/api/wishlist/mine/', {
                headers: { 
                    Authorization: `Bearer ${user.accessToken}`
                }
            });
            setWishlist(response.data?.products || []);
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