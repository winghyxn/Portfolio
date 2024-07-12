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
    const navigate = useNavigate();

    // Assuming token contains the username directly
    const username = token;

    useEffect(() => {
        const fetchPosts = async () => {
          try {
            const response = await axios.get('https://bumbledore-server.vercel.app/posts');
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
        const postID = e.target.dataset.postID;
        console.log(postID);

        const userData = {
            username: username,
            profile: profile,
            postID: postID
        };

        try {
            console.log(userData);
            const response = await axios.post('https://bumbledore-server.vercel.app/new-chat', userData);
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
            {loading ? (
                <div className="main-page">
                    <div className={loaderStyles.loader}></div>
                    <p>loading...</p>
                </div>
                ) : (
                    <div className="main-page">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div key={post._id} className={styles.post}>
                                    <div className={styles.username}>
                                        <div>
                                            <p className={styles.header}>
                                                @<Link className={styles.text} to={`/profile/${post.username}`}>{post.username}</Link>
                                            </p>
                                        </div>
                                        <div>
                                            <p className={styles.header}>#{post._id}</p>
                                        </div>
                                    </div>
                                    <div className={styles.request}>
                                        <div className={styles.text}>
                                            Course Code: {post.courseCode}
                                            <br></br>
                                            Type of Request: {post.typeOfRequest}
                                            <br></br>
                                            Description: {post.description}
                                            <br></br>
                                        </div>      
                                        {post.pay && <div className={styles.text}>Pay: {post.pay}</div>} 
                                        {post.numGroupmates && <div className={styles.text}>Number of Groupmates Needed: {post.numGroupmates}</div>}    
                                    </div>
                                    <div className={styles.apply}>
                                        <div>
                                            <p className={styles.text}>Posted At: {new Date(post.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            {post.username !== username && (
                                            <button 
                                                onClick={handleMessageRequest} 
                                                type="button"
                                                data-username={username}
                                                data-profile={post.username}
                                                data-postID={post._id.toString()}>
                                                    Message
                                            </button>
                                        )}
                                        </div>
                                    </div>
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
