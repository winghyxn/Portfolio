import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/sidebar.js'; // Adjust the path as needed
import useToken from "../components/useToken.js";
import './Home.css';
import styles from '../components/post.module.css';
import loaderStyles from '../components/loader.module.css';

export default function MyPosts() {
    const [posts, setPosts] = useState([]);
    const { token } = useToken();
    const [loading, setLoading] = useState(true);
    const [selectedApplicant, setSelectedApplicant] = useState({});
    const [confirmSelection, setConfirmSelection] = useState({});

    const username = token;

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                const response = await axios.get('https://api-wing-s-projects.vercel.app/posts/my-posts', {
                    params: { username }
                });
                setPosts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch my posts:', error);
            }
        };

        fetchMyPosts();
    }, [username]);

    const handleClosePost = async (postId) => {
        try {
            const response = await axios.patch(`https://api-wing-s-projects.vercel.app/posts/${postId}/close`);
            if (response.status === 200) {
                setPosts(posts.map(post => 
                    post._id === postId ? { ...post, status: 'closed' } : post
                ));
                console.log('Post status updated to closed');
            } else {
                console.error('Failed to close post: Status code:', response.status);
            }
        } catch (error) {
            console.error("Failed to close post", error);
        }
    };

    const handleApplicantChange = (postId, applicant) => {
        setSelectedApplicant(prev => ({ ...prev, [postId]: applicant }));
    };

    const handleConfirmApplicant = async (postId) => {
        const applicant = selectedApplicant[postId];
        if (!applicant) return;
    
        try {
            const response = await axios.patch(`https://api-wing-s-projects.vercel.app/posts/${postId}/accept`, { applicant });
            if (response.status === 200) {
                setPosts(posts.map(post => 
                    post._id === postId ? { ...post, status: 'successful', acceptedApplicant: applicant, applicants: post.applicants.filter(app => app !== applicant) } : post
                ));
                setConfirmSelection(prev => ({ ...prev, [postId]: true }));
                console.log('Applicant accepted successfully');
                window.location.reload(); // Reload the page
            } else {
                console.error('Failed to accept applicant: Status code:', response.status);
            }
        } catch (error) {
            console.error("Failed to accept applicant", error);
        }
    };    

    return (
        <div className="grid-container">
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="header">
                <h1>My Posts</h1>
            </div>
            {loading ? (
                <div className="main-page">
                    <div className={loaderStyles.loader}></div>
                    <p>Loading...</p>
                </div>
            ) : (
                <div className="main-page">
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post._id} className={styles.post}>
                                <h3 className={styles.header}>{post._id}</h3>
                                <h3 className={styles.header}>
                                    Posted by: <Link className={styles.text} to={`/profile/${post.username}`}>{post.username}</Link>
                                </h3>
                                <p className={styles.text}>Course Code: {post.courseCode}</p>
                                <p className={styles.text}>Type of Request: {post.typeOfRequest}</p>
                                <p className={styles.text}>Description: {post.description}</p>
                                {post.pay && <p className={styles.text}>Pay: {post.pay}</p>}
                                {post.numGroupmates && <p className={styles.text}>Number of Groupmates Needed: {post.numGroupmates}</p>}
                                <p className={styles.text}>Created At: {new Date(post.createdAt).toLocaleString()}</p>
                                <p className={styles.text}>Status: {post.status}</p>
                                {post.status === 'open' && (
                                    <>
                                        <button 
                                            onClick={() => handleClosePost(post._id)} 
                                            type="button">
                                            Close Post
                                        </button>
                                        {post.applicants.length > 0 && (
                                            <>
                                                <select
                                                    value={selectedApplicant[post._id] || ""}
                                                    onChange={(e) => handleApplicantChange(post._id, e.target.value)}
                                                    disabled={confirmSelection[post._id]}
                                                >
                                                    <option value="">Select an applicant</option>
                                                    {post.applicants.map(applicant => (
                                                        <option key={applicant} value={applicant}>
                                                            {applicant}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button 
                                                    onClick={() => handleConfirmApplicant(post._id)} 
                                                    type="button"
                                                    disabled={confirmSelection[post._id] || !selectedApplicant[post._id]}
                                                >
                                                    Confirm
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No posts available</p>
                    )}
                </div>
            )}
        </div>
    );
}

