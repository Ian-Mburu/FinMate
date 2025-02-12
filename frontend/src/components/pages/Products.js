import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import Footer from './Footer';
import '../styles/Pages/men.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FaCartShopping } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';

const Products = () => {
    const [products, setProducts] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    const getProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/products/');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

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
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.message || 
                               'Failed to add to wishlist';
            alert(errorMessage);
        }
    };

    return (
        <div className='cont-1'>
            <div className='product-card'>
                {products.map((product) => (
                    <div key={product.id} className="prd-card">
                        <Link className='pd-link' to={`/products/${product.id}`}>
                            <div className="product-image">
                                <img 
                                    className='prd-image' 
                                    src={product.image} 
                                    alt={product.title} 
                                />
                                <div className='pd-1'>
                                    <Link to={`/products/${product.id}`}>
                                        <p className='prd-title'>{product.title}</p>
                                    </Link>
                                    <p className='prd-price'>ksh.{product.price}</p>
                                </div>
                                <div className='star-ratings'>
                                    <div className='wishlist'>
                                        <FaRegHeart 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleAddToWishlist(product);
                                            }} 
                                        />
                                    </div>
                                    <div className='stars'>
                                        {[...Array(5)].map((_, index) => (
                                            <FontAwesomeIcon
                                                key={index}
                                                icon={faStar}
                                                className='star'
                                            />
                                        ))}
                                    </div>
                                    <div className='cart'>
                                        <FaCartShopping
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleAddToCart(product);
                                            }} 
                                            className="add-to-cart-icon"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default Products;