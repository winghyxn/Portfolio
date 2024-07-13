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
                const response = await axios.get('https://api-wing-s-projects.vercel.app/posts/my-applications', {
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
