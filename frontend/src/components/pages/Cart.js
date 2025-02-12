import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/cart.css';

const CartPage = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // CartPage.jsx
useEffect(() => {
    const fetchCart = async () => {
        try {
            const response = await axios.get('/api/cart/', {
                headers: { Authorization: `Bearer ${user.access}` }
            });
            
            // Handle array response structure
            if (response.data.length > 0 && response.data[0].items) {
                setCart(response.data[0].items);
            } else {
                setCart([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Cart fetch error:', error);
            if (error.response?.status === 401) {
                logout();
                navigate('/login');
            }
            setLoading(false);
        }
    };

    if (user) fetchCart();
}, [user]);

    const updateQuantity = async (itemId, newQuantity) => {
        try {
            await axios.patch(`/api/cart/items/${itemId}/`, 
                { quantity: newQuantity },
                { headers: { Authorization: `Bearer ${user.access}` } }
            );
            setCart(cart.map(item => 
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            ));
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await axios.delete(`/api/cart/remove_item/${itemId}/`, {  // Verify this matches your URL config
                headers: { Authorization: `Bearer ${user.access}` }
            });
            setCart(cart.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Remove item failed:', error);
        }
    };

    if (loading) return <div className="loading">Loading cart...</div>;

    return (
        <div className="cart-container">
            <h2 style={{color: "#fff", marginTop: "200px"}}>Your Shopping Cart</h2>
            {cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty</p>
            ) : (
                <>
                    {cart.map(item => (
                        <div key={item.id} className="cart-item">
                            <img src={item.product.image} alt={item.product.title} />
                            <div className="item-details">
                                <h3>{item.product.title}</h3>
                                <p>Price: ${item.product.price}</p>
                                <div className="quantity-controls">
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="total">Total: ${item.total_price}</p>
                                <button 
                                    className="remove-btn"
                                    onClick={() => removeItem(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="cart-summary">
                        <h3>Total: ${cart.reduce((sum, item) => sum + item.total_price, 0)}</h3>
                        <button 
                            className="checkout-btn"
                            onClick={() => navigate('/checkout')}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;