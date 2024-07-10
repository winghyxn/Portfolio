import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/sidebar.js'; // Adjust the path as needed
import useToken from "../components/useToken.js";
import './Home.css';
import styles from '../components/post.module.css';
import loaderStyles from '../components/loader.module.css';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const { token } = useToken();
    const [loading, setLoading] = useState(true);
    const [appliedPosts, setAppliedPosts] = useState({});
    const navigate = useNavigate();

    // Assuming token contains the username directly
    const username = token;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('https://api-wing-s-projects.vercel.app/posts');
                const openPosts = response.data.filter(post => post.status === 'open');
                setPosts(openPosts);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            }
        };

        fetchPosts();
    }, []);

    const handleMessageRequest = async (e) => {
        e.preventDefault();
        const profile = e.target.dataset.profile;
        const postID = e.target.dataset.postid;

        const userData = {
            username: username,
            profile: profile,
            postID: postID
        };

        try {
            const response = await axios.post('https://api-wing-s-projects.vercel.app/new-chat', userData);
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

    const handleApplyRequest = async (postId) => {
        try {
            const response = await axios.patch(`https://api-wing-s-projects.vercel.app/posts/${postId}/apply`, { username });
            if (response.status === 200) {
                console.log('Applied successfully');
                setAppliedPosts(prevState => ({ ...prevState, [postId]: true }));
            } else {
                console.error('Failed to apply:', response.status);
            }
        } catch (error) {
            console.error('Failed to apply:', error);
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
                                {post.username !== username && (
                                    <>
                                        <button 
                                            onClick={handleMessageRequest} 
                                            type="button"
                                            data-username={username}
                                            data-profile={post.username}
                                            data-postid={post._id.toString()}>
                                                Message
                                        </button>
                                        {appliedPosts[post._id] ? (
                                            <p>Post applied successfully</p>
                                        ) : (
                                            <button
                                                onClick={() => handleApplyRequest(post._id)}
                                                type="button"
                                            >
                                                Apply
                                            </button>
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
