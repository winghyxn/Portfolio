import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
//import InfiniteScroll from "react-infinite-scroll-component";
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
                const response = await axios.get('https://bumbledore-server.vercel.app/posts')//"http://localhost:8080/posts");
                const openPosts = response.data.filter(post => post.status === 'Open');
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
            const response = await axios.post('https://bumbledore-server.vercel.app/new-chat'/*'http://localhost:8080/new-chat'*/, userData);
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

    const handleApplyRequest = async (postId, poster) => {
        try {
            console.log(`Applying to post: ${postId}`); // Log the postId
            const url = `https://bumbledore-server.vercel.app/posts/${postId}/apply`;
            console.log(`Request URL: ${url}`); // Log the URL*/
    
            // Apply to the post
            const response = await axios.patch(url, { username });
            if (response.status === 200) {
                console.log('Applied successfully');
                setAppliedPosts(prevState => ({ ...prevState, [postId]: true }));
    
                // Create a chat and send an automatic message
                const chatResponse = await axios.post('https://bumbledore-server.vercel.app/new-chat'/*'http://localhost:8080/new-chat'*/, {
                    username: username,
                    profile: poster,
                    postID: postId
                });
    
                if (chatResponse.status === 200) {
                    const messageResponse = await axios.post('https://bumbledore-server.vercel.app/messages'/*'http://localhost:8080/messages'*/, {
                        sender: username,
                        recipient: poster,
                        postID: postId,
                        message: "Hi! I have applied for your post!"
                    });
    
                    if (messageResponse.status === 200) {
                        console.log('Message sent successfully');
                        navigate('/messages');
                    } else {
                        console.error('Failed to send message: Status code:', messageResponse.status);
                    }
                } else {
                    console.error('Failed to create chat: Status code:', chatResponse.status);
                }
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
                                        <div className={styles.username}>
                                            <div className={styles.header}>
                                                @<Link className={styles.header} to={`/profile/${post.username}`}>{post.username}</Link>
                                            </div>
                                            <div className={styles.header}>
                                                #{post._id}
                                            </div>
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
                                            <div>
                                                {appliedPosts[post._id] ? (
                                                    <div className={styles.text}>Post applied successfully</div>
                                                ) : post.username !== username 
                                                ? (
                                                    <button
                                                        onClick={() => handleApplyRequest(post._id, post.username)}
                                                        type="button"
                                                    >
                                                        Apply
                                                    </button>
                                                ) : (<p></p>)}
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

