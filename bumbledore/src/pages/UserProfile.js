import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/sidebar'; // Adjust the path as needed
import './Home.css'; // Import the new CSS file

export default function UserProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState({ posts: [] }); // Initialize with a default value
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null); // Add error state
    const [newReview, setNewReview] = useState({ postID: '', rating: 0, text: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`https://bumbledore-server.vercel.app/user-profile?username=${username}`);
                console.log('Fetched profile:', response.data);
                setProfile(response.data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                setError(`Failed to fetch profile: ${error.message}`); // Set detailed error message
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`https://bumbledore-server.vercel.app/reviews?username=${username}`);
                console.log('Fetched reviews:', response.data);
                setReviews(response.data);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
                setError(`Failed to fetch reviews: ${error.message}`); // Set detailed error message
            }
        };

        fetchProfile();
        fetchReviews();
    }, [username]);

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setNewReview({ ...newReview, [name]: value });
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`https://bumbledore-server.vercel.app/reviews`, { ...newReview, reviewer: profile.username });
            setReviews([...reviews, response.data]);
            setNewReview({ postID: '', rating: 0, text: '' });
        } catch (error) {
            console.error('Failed to submit review:', error);
            setError(`Failed to submit review: ${error.message}`);
        }
    };

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
                <div className="reviews-section">
                    <h2>Reviews</h2>
                    {reviews.map(review => (
                        <div key={review._id} className="review">
                            <p>Rating: {review.rating}</p>
                            <p>{review.text}</p>
                        </div>
                    ))}
                    <h3>Leave a Review</h3>
                    <form onSubmit={handleReviewSubmit}>
                        <label>
                            Post ID:
                            <select name="postID" value={newReview.postID} onChange={handleReviewChange}>
                                {profile.posts && profile.posts.map(post => (
                                    <option key={post._id} value={post._id}>{post._id}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Rating:
                            <input type="number" name="rating" min="0" max="5" value={newReview.rating} onChange={handleReviewChange} />
                        </label>
                        <label>
                            Review:
                            <textarea name="text" value={newReview.text} onChange={handleReviewChange} />
                        </label>
                        <button type="submit">Submit Review</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

