import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/sidebar.js'; // Adjust the path as needed
import useToken from "../components/useToken.js";
import './Home.css';
import styles from '../components/post.module.css';
import loaderStyles from '../components/loader.module.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function MyPosts() {
    const [posts, setPosts] = useState([]);
    const { token } = useToken();
    const [loading, setLoading] = useState(true);
    const [selectedApplicant, setSelectedApplicant] = useState({});
    const [confirmSelection, setConfirmSelection] = useState({});
    const [clickCounts, setClickCounts] = useState({});

    const username = token;

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                const response = await axios.get('https://bumbledore-server.vercel.app/posts/my-posts', {
                    params: { username }
                });
                const postsData = response.data;
                setPosts(postsData);

                for (const post of postsData) {
                    try {
                        const clickResponse = await axios.get(`https://bumbledore-server.vercel.app/clicks/${post._id}`);
                        setClickCounts(prevCounts => ({
                            ...prevCounts,
                            [post._id]: clickResponse.data
                        }));
                    } catch (error) {
                        console.error(`Failed to fetch click data for post ${post._id}:`, error.response ? error.response.data : error.message);
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch my posts:', error.response ? error.response.data : error.message);
            }
        };

        fetchMyPosts();
    }, [username]);

    const handleClosePost = async (postId) => {
        try {
            const response = await axios.patch(`https://bumbledore-server.vercel.app/posts/${postId}/close`);
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
            const response = await axios.patch(`https://bumbledore-server.vercel.app/posts/${postId}/accept`, { applicant });
            if (response.status === 200) {
                setPosts(posts.map(post => 
                    post._id === postId ? { ...post, status: 'Successful', acceptedApplicant: applicant, applicants: post.applicants.filter(app => app !== applicant) } : post
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

    const handleButtonClick = async (postId, type) => {
        console.log(`Button clicked: postId=${postId}, type=${type}`); // Add this line for debugging

        setClickCounts(prevCounts => ({
            ...prevCounts,
            [postId]: {
                ...prevCounts[postId],
                [type]: (prevCounts[postId]?.[type] || 0) + 1
            }
        }));

        try {
            await axios.post(`https://bumbledore-server.vercel.app/clicks/${postId}`, { type });
        } catch (error) {
            console.error('Failed to update click data:', error);
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
                                <div className={styles.username}>
                                    <div className={styles.header}>
                                        @<Link className={styles.text} to={`/profile/${post.username}`} onClick={() => handleButtonClick(post._id, 'usernameClicks')}>{post.username}</Link>
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
                                    {post.status === 'Open' && (
                                        <>
                                            <button 
                                                onClick={() => {handleClosePost(post._id); handleButtonClick(post._id, 'closeClicks')}} 
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
                                    {post.acceptedApplicant && (
                                        <div className={styles.header}>
                                            Accepted: @<Link className={styles.text} to={`/profile/${post.acceptedApplicant}`}>{post.acceptedApplicant}</Link>
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => handleButtonClick(post._id, 'insights')}>
                                    Show Insights
                                </button>
                                {clickCounts[post._id] && (
                                    <BarChart
                                        width={500}
                                        height={300}
                                        data={[
                                            { name: 'Message Clicks', count: clickCounts[post._id].messageClicks || 0 },
                                            { name: 'Apply Clicks', count: clickCounts[post._id].applyClicks || 0 },
                                            { name: 'Profile Clicks', count: (clickCounts[post._id].usernameClicksHome || 0) + (clickCounts[post._id].usernameClicksApps || 0) + (clickCounts[post._id].usernameClicksMessages || 0) },
                                        ]}
                                        margin={{
                                            top: 5, right: 30, left: 20, bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#8884d8" />
                                    </BarChart>
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
