import React from 'react';
import shoeImage from '../images/shoe2.jpg'
import '../styles/pages/home.css';
import { FaFacebook, FaInstagram, FaShippingFast } from "react-icons/fa";
import { FaRecycle } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import { CiInstagram, CiTwitter } from "react-icons/ci";
import { CiFacebook } from "react-icons/ci";
import { CiLinkedin } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Adjust based on how you manage state
import { FaRegCopyright } from "react-icons/fa6";
import { FaPaypal } from "react-icons/fa6";
import { FaCcStripe } from "react-icons/fa6";
import { SiVisa } from "react-icons/si";




function Home() {

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/products');
  }

  return (
    <div className='home'>
      <div className='back-image'>
          <div className='background'>

            <div className='text'>
              <p className='par'>Love The Planet <br/> We Walk On</p>
              <p className='par-2'>Discover Our Collection</p>
            </div>

            <div className='buttons'>
              <button className='btn' onClick={handleNavigate} >Shop Products</button>
            </div>
          </div>
          
      </div>

      <hr/>

      <div className='cont-2'>
        <div className='image-i'>
          <img className='image-1' src={shoeImage} alt='nike'/>
        </div>

        <div className='abt'>
          <p className='par-3'>About Us</p>
          <p className='par-4'>Selected materials <br/> designed for comfort <br/> and sustainability</p>
          <p className='par-5'>At FinMate, we’re more than a store – we’re <br/> a community of fashion-forward individuals <br/> committed to a more sustainable future. <br/> We believe that giving pre-loved shoes a second life <br/> not only saves you money but also reduces the <br/> environmental impact of fashion waste.</p>
          <a href='/about'>Read More</a>
        </div>
      </div>


      <div className='cont-3'>
        <p className='p-1'>
          <FaLock className='icon-h' />
          Secure Payment
        </p>

          <hr/>
        <p>
          <FaShippingFast className='icon-h' />
          Secure Payment
        </p>

        <hr/>
        <p>
          <FaRecycle className='icon-h' />
          Secure Payment
        </p>
      </div>
      <hr />

      <div className='footer'>
        <div className='fin'>
          <h4>FinMate</h4>
          <p className='par-6'>We’re proud to support <br/> sustainable fashion. <br/> By choosing FinMate, <br/> you’re helping to <br/> reduce landfill waste <br/> and make eco-friendly <br/> choices <br/> without compromising style.</p>
        </div>


        <div className='shop'>
          <h4>Shop</h4>
          <a href='#'>Shop Men</a>
          <a href='#'>Shop Women</a>
          <a href='#'>LookBook</a>
          <a href='#'>Gift Card</a>
          <a href='#'>Sale</a>
        </div>
    
        <div className='about'>
        <h4>About</h4>
          <a href='#'>Our Story</a>
          <a href='#'>Our Materials</a>
          <a href='#'>Our Value</a>
          <a href='#'>Sustainability</a>
          <a href='#'>Manufacture</a>
        </div>

        <div className='help'>
        <h4>Need Help?</h4>
          <a href='#'>FAQs</a>
          <a href='#'>Shipping & Returns</a>
          <a href='#'>Shoe Care</a>
          <a href='#'>Size Chart</a>
          <a href='#'>Contact Us</a>
        </div>

        <div className='icons'>
        <a href='#'><FaInstagram /></a>
        <a href='#'><FaFacebook /></a>
        <a href='#'><CiLinkedin /></a>
        <a href='#'><CiTwitter /></a>
      </div>
      </div>

      <div className='copyright'>
        <p><FaRegCopyright />  Recycled Shoe Store. Powered by Recycled Shoe Store. </p>
        
        <icons>
          <FaCcStripe size={30} />
          <FaPaypal size={30} />
          <SiVisa size={30} />
        </icons>
      </div>

      
    </div>
  );
}

export default Home;