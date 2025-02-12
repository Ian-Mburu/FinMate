import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/checkout.css';

const CheckoutPage = () => {
    const [formData, setFormData] = useState({
        shipping_address: '',
        payment_method: 'paypal'
    });
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await axios.post('/api/checkout/', formData, {
                headers: { Authorization: `Bearer ${user.access}` }
            });

            if (response.data.status === 'completed') {
                navigate(`/order-confirmation/${response.data.id}`);
            }
        } catch (error) {
            console.error('Checkout failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-group">
                    <label>Shipping Address</label>
                    <textarea
                        name="shipping_address"
                        value={formData.shipping_address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Payment Method</label>
                    <select
                        name="payment_method"
                        value={formData.payment_method}
                        onChange={handleChange}
                    >
                        <option value="paypal">PayPal</option>
                        <option value="credit_card">Credit Card</option>
                    </select>
                </div>

                <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Complete Order'}
                </button>
            </form>
        </div>
    );
};

export default CheckoutPage;