import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/sidebar.js'; // Adjust the path as needed
import useToken from "../components/useToken.js";
import './Home.css';
import styles from '../components/post.module.css';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const { token } = useToken();
    const navigate = useNavigate();

    // Assuming token contains the username directly
    const username = token;

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

    const handleMessageRequest = async (e) => {
        e.preventDefault();
        const postUsername = e.target.dataset.username;

        const userData = {
            username: postUsername,
            profile: postUsername
        };

        try {
            const response = await axios.post('http://localhost:8080/new-chat', userData);
            if (response.status === 200) {
                console.log('Chat created successfully:', response.data);
                navigate('/messages');
            } else {
                console.error('Failed to create chat: Status code:', response.status);
            }
        } catch (error) {
            console.error("Failed to create chat", error);
        }
    };

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
                                Posted by: <Link className={styles.text} to={`/profile/${post.username}`}>{post.username}</Link>
                            </h3>
                            <p className={styles.text}>Course Code: {post.courseCode}</p>
                            <p className={styles.text}>Type of Request: {post.typeOfRequest}</p>
                            <p className={styles.text}>Description: {post.description}</p>
                            {post.pay && <p className={styles.text}>Pay: {post.pay}</p>}
                            {post.numGroupmates && <p className={styles.text}>Number of Groupmates Needed: {post.numGroupmates}</p>}
                            <p className={styles.text}>Created At: {new Date(post.createdAt).toLocaleString()}</p>
                            {post.username !== username && (
                                <button 
                                    onClick={handleMessageRequest} 
                                    type="button"
                                    data-username={post.username}
                                    data-profile={post.username}>
                                        Message
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No posts available</p>
                )}
            </div>
        </div>
    );
}

