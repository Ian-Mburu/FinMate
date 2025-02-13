import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { FaCartShopping } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';
import axios from "axios";
import './Nav.css';

const Nav = () => {
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        const fetchCounts = async () => {
            if (!user) return;
    
            try {
                const token = localStorage.getItem('access_token');
                
                // Cart request
                const cartRes = await axios.get('http://localhost:8000/api/cart/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Wishlist request
                const wishRes = await axios.get('http://localhost:8000/api/wishlist/mine/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
    
                setCartCount(cartRes.data?.items?.length || 0);
                setWishlistCount(wishRes.data?.products?.length || 0);
            } catch (error) {
                console.error('Count fetch error:', error);
                if (error.response?.status === 401) {
                    logout();
                }
            }
        };
    
        fetchCounts(); // Initial fetch
        
        const interval = setInterval(fetchCounts, 300000); // Fetch every 5 minutes
        
        return () => clearInterval(interval);
    }, [user, logout]);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <NavLink className="logo" to="/">FinMate</NavLink>

            <form className="search-form">
                <input
                    className="search"
                    type="text"
                    name="q"
                    placeholder="Search for products..."
                />
            </form>

            <div className="links">
                <div className="dropdown" onMouseLeave={() => setDropdownOpen(false)}>
                    <button 
                        className="user-icon"
                        onMouseEnter={() => setDropdownOpen(true)}
                    >
                        <FaUser size={16} />
                        {user && <span className="username-badge">{user.username[0]}</span>}
                    </button>
                    
                    <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
                        {user ? (
                            <>
                                <button className="btn-nav" onClick={() => navigate(`/profile/${user.username}`)}>
                                    Profile
                                </button>
                                <button className="btn-nav">
                                    Settings
                                </button>
                                <button className="btn-nav" onClick={handleLogout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn-nav" onClick={() => navigate('/login')}>
                                    Login
                                </button>
                                <button className="btn-nav" onClick={() => navigate('/signup')}>
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <NavLink className="nav-item" to="/">Home</NavLink>
                {!user && <NavLink className="nav-item" to="/login">Login</NavLink>}
                <NavLink className="nav-item" to="/products">Products</NavLink>
                <NavLink className="nav-item" to="/about">About</NavLink>
                
                <NavLink className="nav-item" to="/cart">
                    <FaCartShopping size={16} />
                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </NavLink>
                
                <NavLink className="nav-item" to="/wishlist">
                    <FaRegHeart size={16} />
                    {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
                </NavLink>
            </div>
        </nav>
    );
};

export default Nav;