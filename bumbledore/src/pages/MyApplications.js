import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/sidebar.js'; // Adjust the path as needed
import useToken from "../components/useToken.js";
import './Home.css';
import styles from '../components/post.module.css';
import loaderStyles from '../components/loader.module.css';

export default function MyApplications() {
    const [appliedPosts, setAppliedPosts] = useState([]);
    const { token } = useToken();
    const [loading, setLoading] = useState(true);

    const username = token;

    useEffect(() => {
        const fetchMyApplications = async () => {
            try {
                const response = await axios.get('https://bumbledore-server.vercel.app/posts/my-applications', {
                    params: { username }
                });
                setAppliedPosts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch my applications:', error);
            }
        };

        fetchMyApplications();
    }, [username]);

    const handleUsernameClick = async (postId) => {
        try {
            // Update usernameClicksApps when a username is clicked
            await axios.post(`https://bumbledore-server.vercel.app/clicks/${postId}`, { type: 'usernameClicksApps' });
        } catch (error) {
            console.error('Failed to update usernameClicksApps:', error);
        }
    };

    return (
        <div className="grid-container">
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="header">
                <h1>My Applications</h1>
            </div>
            {loading ? (
                <div className="main-page">
                    <div className={loaderStyles.loader}></div>
                    <p>Loading...</p>
                </div>
            ) : (
                <div className="main-page">
                    {appliedPosts.length > 0 ? (
                        appliedPosts.map((post) => (
                            <div key={post._id} className={styles.post}>
                                <div className={styles.username}>
                                    <div className={styles.header}>
                                        @<Link
                                            className={styles.text}
                                            to={`/profile/${post.username}`}
                                            onClick={() => handleUsernameClick(post._id)}
                                        >
                                            {post.username}
                                        </Link>
                                    </div>
                                    <div className={styles.header}>#{post._id}</div>
                                    <div className={styles.text}>status: {post.status}</div>
                                </div>
                                <div className={styles.request}>
                                    <div className={styles.text}>
                                        Course Code: {post.courseCode}
                                    </div>
                                    <div className={styles.text}>
                                        Type of Request: {post.typeOfRequest}
                                    </div>
                                    <div className={styles.text}>
                                        Description: {post.description}
                                    </div>    
                                    {post.pay && <div className={styles.text}>Pay: {post.pay}</div>} 
                                    {post.numGroupmates && <div className={styles.text}>Number of Groupmates Needed: {post.numGroupmates}</div>}    
                                </div>
                                <div className={styles.apply}>
                                    <div className={styles.text}>{new Date(post.createdAt).toLocaleString()}</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No applications made</p>
                    )}
                </div>
            )}
        </div>
    );
}
