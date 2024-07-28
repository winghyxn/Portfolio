import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useToken from "../components/useToken.js";
import Sidebar from '../components/sidebar'; // Adjust the path as needed
import formStyles from "../components/form.module.css";
import './Home.css'; // Import the new CSS file
export default function UserProfile() {
    const { username } = useParams();
    const { token } = useToken();
    const [profile, setProfile] = useState({});
    const [reviews, setReviews] = useState([]);
    const [reviewOptions, setReviewOptions] = useState([]);
    const [selectedID, setSelectedID] = useState("");
    const [newReview, setNewReview] = useState({ postID: '', rating: 0, text: '', reviewer: ''});
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`https://bumbledore-server.vercel.app/user-profile?username=${username}`);
                console.log('Fetched profile:', response.data);
                setProfile(response.data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                setError(`Failed to fetch profile: ${error.message}`);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`https://bumbledore-server.vercel.app/reviews?username=${username}`);
                console.log('Fetched reviews:', response.data);
                setReviews(response.data);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
                setError(`Failed to fetch reviews: ${error.message}`);
            }
        };
        fetchProfile();
        fetchReviews();
    }, [username]);

    const fetchReviewablePosts = async () => {
        try {
            const response = await axios.get(`https://bumbledore-server.vercel.app/posts/reviewable-posts?first=${username}&&second=${token}`);
            console.log('Fetched reviewable posts:', response.data);
            setReviewOptions(response.data);
        } catch (error) {
            console.error('Failed to fetch reviewable posts:', error);
            setError(`Failed to fetch reviewable posts: ${error.message}`);
        }
    }

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setNewReview({ ...newReview, [name]: value });
    };

    const handleIDSelection = (e) => {
        setSelectedID(e.target.value);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const reviewData = {
                postID: selectedID,
                rating: newReview.rating,
                text: newReview.text, 
                reviewer: token,
                reviewee: profile.username
            };

            const response = await axios.post(`https://bumbledore-server.vercel.app/reviews`, reviewData);
            setReviews([...reviews, response.data]);
            setSelectedID("");
            setNewReview({ postID: '', rating: 0, text: '', reviewer: '', reviewee: ''});
            setShowForm(false);
        } catch (error) {
            console.error('Failed to submit review:', error);
            setError(`Failed to submit review: ${error.message}`);
        }
    };

    const averageRating = (reviews.length > 0) ? (
        (reviews.map((review) => parseInt(review.rating)).reduce((accumulator, currentValue) => accumulator + currentValue, 0) / reviews.length).toFixed(2)
    ) : (
        "-"
    );

    if (error) {
        return <p>{error}</p>;
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
            {showForm ? (
                <div className="main-page">
                    <form onSubmit={handleReviewSubmit} className={formStyles.form}>
                        <label className={formStyles.label}>
                            Post ID:
                            <select
                                name="postID" 
                                value={selectedID} 
                                onChange={handleIDSelection}
                                className={formStyles.inputs}>
                                    <option value="" className={formStyles.inputs}>
                                        Select
                                    </option> 
                                    {reviewOptions && reviewOptions.map(option => (
                                    <option 
                                        className={formStyles.inputs}
                                        key={option._id} 
                                        value={option._id}>
                                            {option._id}
                                    </option>            
                                ))}
                            </select>
                        </label>
                        <label className={formStyles.label}>
                            Rating:
                            <input 
                                type="number" 
                                name="rating" 
                                min="0" 
                                max="5" 
                                value={newReview.rating} 
                                onChange={handleReviewChange} 
                                className={formStyles.inputs}/>
                        </label>
                        <label className={formStyles.label}>
                            Review:
                            <textarea 
                                name="text" 
                                value={newReview.text} 
                                onChange={handleReviewChange}
                                className={formStyles.inputs} />
                        </label>
                        <button type="submit">Submit Review</button>
                    </form>
                </div>
            ) : (
                <div className="main-page">
                    <div className="content-box">
                        <p className="content-text">Year: {profile.year}</p>
                        <p className="content-text">Major: {profile.major}</p>
                        <p className="content-text">Description: {profile.description}</p>
                        <p className="content-text">Average rating: {averageRating}</p>
                    </div>
                    <div className="content-box">
                        <h3 className="content-text">Reviews: </h3> 
                        {reviews.map(review => (
                            <div key={review._id} className="content-text">
                                <p className="content-text">-----------------------</p>
                                <p className="content-text">Rating: {review.rating}</p>
                                <p className="content-text">Description: {review.text}</p>
                            </div>
                        ))}
                    </div>
                    <div>
                        <button type="button" onClick={() => {
                            setShowForm(true);
                            fetchReviewablePosts();
                            }}>Leave a review</button>
                    </div>
                </div>
            )}
        </div>
    );
}

