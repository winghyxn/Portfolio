import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/sidebar'; // Adjust the path as needed
import './Home.css';
import styles from '../components/post.module.css';

export default function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/posts');
                setPosts(response.data);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="grid-container">
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="header">
                <h1>All Posts</h1>
            </div>
            <div className="main-page">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post._id} className={styles.post}>
                            <h3 className={styles.header}>
                                Posted by: <Link to={`/profile/${post.username}`}>{post.username}</Link>
                            </h3>
                            <p className={styles.text}>Course Code: {post.courseCode}</p>
                            <p className={styles.text}>Type of Request: {post.typeOfRequest}</p>
                            <p className={styles.text}>Description: {post.description}</p>
                            {post.pay && <p className={styles.text}>Pay: {post.pay}</p>}
                            {post.numGroupmates && <p className={styles.text}>Number of Groupmates Needed: {post.numGroupmates}</p>}
                            <p className={styles.text}>Created At: {new Date(post.createdAt).toLocaleString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No posts available</p>
                )}
            </div>
        </div>
    );
}

