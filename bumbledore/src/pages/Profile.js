import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../components/sidebar.js";
import formStyles from "../components/form.module.css";
import useToken from "../components/useToken.js";
import './Home.css';

export default function Profile() {
    const [showForm, setShowForm] = useState(false);
    const [inputs, setInputs] = useState({});
    const [profile, setProfile] = useState({})
    const { token, setToken } = useToken();

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/my-profile", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: token, // Changed from email to username
                    year: inputs.year,
                    major: inputs.major,
                    description: inputs.description
                })
            });

            if (!response.ok) {
                console.error('Failed to edit profile: Status code:', response.status);
                alert('Failed to edit profile');
            }

            setShowForm(false); // Close the form after successful submission
        } catch (error) {
            console.error("Failed to edit profile: ", error);
            alert('Failed to edit profile');
        }
    }

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/my-profile?username=${token}`);
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="grid-container">
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="header">
                <h1>My Profile</h1>
            </div>
                {showForm ? (
                <div className="main-page">
                    <form onSubmit={handleSubmit} className={formStyles.form}>
                        <label className={formStyles.label}>
                            Year:
                            <input
                                type="text"
                                name="year"
                                value={inputs.year || ''}
                                onChange={handleChange}
                                className={formStyles.inputs}
                            />
                        </label>
                        <label className={formStyles.label}>
                            Major:
                            <input
                                type="text"
                                name="major"
                                value={inputs.major || ''}
                                onChange={handleChange}
                                className={formStyles.inputs}
                            />
                        </label>
                        <label className={formStyles.label}>
                            Description:
                            <input
                                type="text"
                                name="description"
                                value={inputs.description || ''}
                                onChange={handleChange}
                                className={formStyles.inputs}
                            />
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                    <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
                ) : (
                <div className="main-page">
                    <h2>Welcome, {token}!</h2> {/* Display username */}
                    <div className="content-box">
                        <p className="content-text">Year: {profile.year}</p>
                        <p className="content-text">Major: {profile.major}</p>
                        <p className="content-text">Description: {profile.description}</p>
                    </div>
                    <button onClick={() => setShowForm(true)}>Edit Profile</button>
                </div>
                )} 
            </div>
    );
}
