import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Pages/profile.css'
import Footer from '../pages/Footer'


const Profile = () => {
    const { username } = useParams(); // Get userId from URL
    const [user, setUser ] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/user/${username}/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };


        fetchUserProfile(); // Call the function to fetch user data
    }, [username]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="user">
            <div className="user-profile">
                <img className="avatar-image" src={`http://localhost:8000/media/cat.png`} alt="Default Avatar" />
                <h4>Name: {user.name}</h4>
                <p>Email: {user.email}</p>
                <p className='bio'> <h className='bio-b'>Bio:</h> <p className='bio-c'>{user.bio}</p> </p>
                <a className='btnUpdateProfile' href='/UpdateProfile'>Update Profile</a>
            </div>
            <Footer/>
        </div>
    );
};

export default Profile;