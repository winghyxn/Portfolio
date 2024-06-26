import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../components/sidebar.js";
import formStyles from "../components/form.module.css";
import useToken from "../components/useToken.js";
import './Home.css';

export default function Profile() {
    const [showForm, setShowForm] = useState(false);
    const [inputs, setInputs] = useState({});
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState({})
    const { token, setToken } = useToken();

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); // Clear previous error

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
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Something went wrong');
            }

            setShowForm(false); // Close the form after successful submission
        } catch (error) {
            setError(error.message);
        }
    }

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/my-profile?token=${token}`);
            setProfile(response.data)
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="App">
            <Sidebar />
            <header className="App-header">
                <h1>Profile Page</h1>
                <h2>Welcome, {token}!</h2> {/* Display username */}
                <p>Year: {profile.year}</p>
                <p>Major: {profile.major}</p>
                <p>Description: {profile.description}</p>
                <div className="Home">
                    <button onClick={() => setShowForm(true)}>Edit Profile</button>
                </div>
                {showForm && (
                    <form onSubmit={handleSubmit} className={formStyles.form}>
                        <label>
                            Year:
                            <input
                                type="text"
                                name="year"
                                value={inputs.year || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Major:
                            <input
                                type="text"
                                name="major"
                                value={inputs.major || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Description:
                            <input
                                type="text"
                                name="description"
                                value={inputs.description || ''}
                                onChange={handleChange}
                            />
                        </label>
                        {error && <div className="error">{error}</div>}
                        <button type="submit">Submit</button>
                        <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                    </form>
                )}
            </header>
        </div>
    );
}
