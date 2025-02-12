import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/orderConfirmation.css';

const OrderConfirmationPage = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`/api/orders/${id}/`, {
                    headers: { Authorization: `Bearer ${user.access}` }
                });
                setOrder(response.data);
            } catch (error) {
                console.error('Order fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchOrder();
    }, [id, user]);

    if (loading) return <div className="loading">Loading order details...</div>;

    return (
        <div className="order-confirmation">
            <h2>Order Confirmation #{order.id}</h2>
            <div className="order-details">
                <p>Status: {order.status}</p>
                <p>Total: ${order.total_price}</p>
                <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                <p>Shipping Address: {order.shipping_address}</p>
            </div>

            <h3>Order Items:</h3>
            <div className="order-items">
                {order.items.map(item => (
                    <div key={item.id} className="order-item">
                        <img src={item.product.image} alt={item.product.title} />
                        <div className="item-info">
                            <h4>{item.product.title}</h4>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${item.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderConfirmationPage;