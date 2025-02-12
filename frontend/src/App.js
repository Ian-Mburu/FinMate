import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from './components/Navbar/Nav';
import ProductDetails from './components/products/ProductDetails';
import Home from './components/pages/Home';
import ShowProduct from './components/products/ShowProduct';
import Products from './components/pages/Products';
import Profile from './components/pages/Profile';
import UpdateProfile from './components/pages/UpdateProfile';
import About from './components/pages/About';
import Cart from './components/pages/Cart';
import Wishlist from './components/pages/Wishlist'
import Signup from './components/pages/Signup';
import Login from './components/pages/Login';
import Checkout from './components/pages/Checkout';
import OrderConfirmation from './components/pages/OrderConfirmation';
import { AuthProvider } from './components/context/AuthContext';

function App() {
  const [user, setUser] = useState(null); // Manage current user state

  useEffect(() => {
    // Fetch the current user when the app loads
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUser(null);
        return;
      }
    
      try {
        const response = await fetch('http://localhost:8000/api/current-user/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
    
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      }
    };
    

    fetchUser();
  }, []);

  return (
    <AuthProvider>
    <Router>
      <Nav user={user} /> {/* Pass user as a prop */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path='/UpdateProfile' element={<UpdateProfile user={user} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/showProduct" element={<ShowProduct />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Routes>
      <ToastContainer />
    </Router>
    </AuthProvider>
  );
}

export default App;
