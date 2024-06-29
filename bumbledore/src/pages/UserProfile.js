import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/sidebar'; // Adjust the path as needed
import './Home.css'; // Import the new CSS file

export default function UserProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null); // Add error state

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user-profile?username=${username}`);
                console.log('Fetched profile:', response.data);
                setProfile(response.data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                setError(`Failed to fetch profile: ${error.message}`); // Set detailed error message
            }
        };

        fetchProfile();
    }, [username]);

    if (error) {
        return <p>{error}</p>; // Display error message
    }

    if (!profile) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="grid-container">
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="header">
                <h1>{profile.username}'s Profile</h1>
            </div>
            <div className="main-page">
                <div className="content-box">
                    <p className="content-text">Year: {profile.year}</p>
                    <p className="content-text">Major: {profile.major}</p>
                    <p className="content-text">Description: {profile.description}</p>
                </div>
            </div>
        </div>
    );
}
