import React, { useState, useEffect } from 'react';
import useToken from "../components/useToken.js";
import formStyles from "../components/form.module.css";
import axios from 'axios';
import PropTypes from 'prop-types';

export default function Review({username, onSubmit}) {
    const { token } = useToken();
    //const [profile, setProfile] = useState({}); // Initialize with a default value
    const [reviews, setReviews] = useState([]);
    const [reviewOptions, setReviewOptions] = useState([]);
    const [selectedID, setSelectedID] = useState("");
    const [newReview, setNewReview] = useState({ postID: '', rating: 0, text: '', reviewer: ''});
    //const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviewablePosts = async () => {
            try {
                const response = await axios.get(`https://bumbledore-server.vercel.app/posts/reviewable-posts?first=${username}&&second=${token}`/*`http://localhost:8080/posts/reviewable-posts?first=${username}&&second=${token}`*/);
                console.log('Fetched reviewable posts:', response.data);
                setReviewOptions(response.data);
            } catch (error) {
                console.error('Failed to fetch reviewable posts:', error);
                //setError(`Failed to fetch reviewable posts: ${error.message}`); // Set detailed error message
            }
        }

        fetchReviewablePosts();
    }, [username, token])

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
                reviewee: username
            };

            const response = await axios.post(`https://bumbledore-server.vercel.app/reviews`/*`http://localhost:8080/reviews`*/, reviewData);
            setReviews([...reviews, response.data]); // when u edit review it shows up as new review, but w page refresh it is updated as same review
            setSelectedID("");
            setNewReview({ postID: '', rating: 0, text: '', reviewer: '', reviewee: ''});
            onSubmit(response.data);
        } catch (error) {
            console.error('Failed to submit review:', error);
            //setError(`Failed to submit review: ${error.message}`);
        }
    };

    return (
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
    )
}


Review.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};
  