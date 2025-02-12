import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../pages/Footer';
import '../styles/pages/prd-details.css';
import { useAuth } from '../context/AuthContext';

const ProductsDetails = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Handle adding product to the cart
    const handleAddToCart = async (product) => {
        if (!user) {
            alert('Please login to add items to cart');
            navigate('/login');
            return;
        }

        try {
            await axios.post('/api/cart/add_item/', 
                { product_id: product.id, quantity: 1 },
                { headers: { Authorization: `Bearer ${user.access}` } }
            );
            alert(`${product.title} added to cart!`);
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.message || 
                               'Failed to add to cart';
            alert(errorMessage);
        }
    };

    // Handle adding product to the wishlist
    const handleAddToWishlist = async (product) => {
        if (!user) {
            alert('Please login to add items to wishlist');
            navigate('/login');
            return;
        }

        try {
            await axios.post('/api/wishlist/add_product/', 
                { product_id: product.id },
                { headers: { Authorization: `Bearer ${user.access}` } }
            );
            alert(`${product.title} added to wishlist!`);
        } catch (error) {
            const errorMessage = error.response?.data?.error || 
                               error.response?.data?.message || 
                               'Failed to add to wishlist';
            alert(errorMessage);
        }
    };

    // Fetch product details
    const getSingleProduct = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get(`http://localhost:8000/api/products/${id}/`);
            if (data) {
                setProduct(data);
            } else {
                setError('Product data not found');
            }
        } catch (err) {
            setError('Failed to load product details');
            console.error('Error fetching product:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSingleProduct();
    }, [id]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!product) {
        return <div className="not-found">Product not found</div>;
    }

    return (
        <div className='prd-details'>
            <div className='j'>
                <div className="product-image2">
                    {product.image ? (
                        <img 
                            className='prd-image2'
                            src={product.image} 
                            alt={product.title}
                        />
                    ) : (
                        <div className="image-placeholder">No Image Available</div>
                    )}
                </div>

                <div className='details'>
                    <div className='tp1'>
                        <h2>{product.title}</h2>
                        <p className="price">ksh.{Number(product.price).toFixed(2)} <span className='free'>& free shipping</span></p>
                        <p className="description">{product.description}</p>
                    </div>

                    <p>Shoes In Stock: {product.quantity}</p>

                    <button 
                        className='cart-btn' 
                        onClick={() => handleAddToCart(product)}
                    >
                        Add To Cart
                    </button>

                    <button 
                        className='cart-btn' 
                        onClick={() => handleAddToWishlist(product)}
                    >
                        Add To Wishlist
                    </button>
                </div>
            </div>

            <Footer/>
        </div>
    );
};

export default ProductsDetails;