import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar'; // Adjust the path as needed
import styles from './Home.css';

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
        <div className={styles.gridContainer}>
            <Sidebar className={styles.sidebar} />
            <div className={styles.mainPage}>
                <div className={styles.header}>
                    <h2>All Posts</h2>
                </div>
                <div className={styles.contentBox}>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post._id} className={styles.postCard}>
                                <h3>{post.courseCode}</h3>
                                <p>Type of Request: {post.typeOfRequest}</p>
                                <p>Description: {post.description}</p>
                                {post.pay && <p>Pay: {post.pay}</p>}
                                {post.numGroupmates && <p>Number of Groupmates Needed: {post.numGroupmates}</p>}
                                <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
                            </div>
                        ))
                    ) : (
                        <p>No posts available</p>
                    )}
                </div>
            </div>
        </div>
    );
}
