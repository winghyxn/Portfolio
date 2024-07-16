import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../components/sidebar.js";
import formStyles from "../components/form.module.css";
import useToken from "../components/useToken.js";
import './Home.css';

export default function Profile() {
    const { token } = useToken();
    const [showForm, setShowForm] = useState(false);
    const [inputs, setInputs] = useState({});
    const [profile, setProfile] = useState({});
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const profileData = {
                username: token,
                year: inputs.year,
                major: inputs.major,
                description: inputs.description
            }

            const response = await axios.post(`https://bumbledore-server.vercel.app/my-profile`, profileData);

            setProfile(response.data);
            setShowForm(false); // Close the form after successful submission
        } catch (error) {
            console.error("Failed to edit profile: ", error);
            setError(`Failed to edit profile: ${error.message}`);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`https://bumbledore-server.vercel.app/my-profile?username=${token}`);
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`https://bumbledore-server.vercel.app/reviews?username=${token}`); //`http://localhost:8080/reviews?username=${username}`);
                console.log('Fetched reviews:', response.data);
                setReviews(response.data);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
                setError(`Failed to fetch reviews: ${error.message}`); // Set detailed error message
            }
        };

        fetchProfile();
        fetchReviews();
    }, [token]); // Only run when token changes

    if (error) {
        return <p>{error}</p>; // Display error message
    }

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
                                type="number"
                                name="year"
                                min="1" 
                                max="6"
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
                    <div>
                        <button type="button" onClick={() => setShowForm(false)}>Back</button>
                    </div>
                </div>
            ) : (
                <div className="main-page">
                    <h2>Welcome, {token}!</h2> {/* Display username */}
                    <div className="content-box">
                        <p className="content-text">Year: {profile.year}</p>
                        <p className="content-text">Major: {profile.major}</p>
                        <p className="content-text">Description: {profile.description}</p>
                    </div>
                    <div className="content-box">
                        <h3 className="content-text">Reviews: </h3> 
                        {reviews.map(review => (
                            <div key={review._id} className="content-text">
                                <p className="content-text">Rating: {review.rating}</p>
                                <p className="content-text">Description: {review.text}</p>
                            </div>
                        ))}
                    </div>
                    <div>
                        <button onClick={() => setShowForm(true)}>Edit Profile</button>
                    </div>
                </div>
            )}
        </div>
    );
}

