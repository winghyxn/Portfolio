import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Import Link component
import useToken from "../components/useToken.js";
import styles from './Messages.module.css';

export default function Messages() {
    const [userChats, setUserChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [showChat, setShowChat] = useState({ other: "", postID: "" });
    const [input, setInput] = useState("");
    const { token } = useToken();

    const handleMessage = async (e) => {
        e.preventDefault();
        const sender = e.target.dataset.sender;
        const recipient = e.target.dataset.recipient;
        const postID = e.target.dataset.postid;

        const messageData = {   
            sender: sender,
            recipient: recipient,
            postID: postID,
            message: input
        };

        try {
            const response = await axios.post('https://bumbledore-server.vercel.app/messages', messageData);
            if (response.status === 200) {
                fetchMessages(showChat);
            } 
        } catch (error) {
            console.error("Failed to send message", error);
        }
        setInput('');
    };

    const fetchMessages = async (chat) => {
        try {
            const response = await axios.get(`https://bumbledore-server.vercel.app/messages?sender=${token}&&recipient=${chat.other}&&postID=${chat.postID}`);
            console.log('Fetched messages:', response.data);
            setMessages(response.data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    useEffect(() => {
        const fetchUserChats = async () => {
            try {
                const response = await axios.get(`https://bumbledore-server.vercel.app/chats?username=${token}`);
                setUserChats(response.data);
            } catch (error) {
                console.error('Failed to fetch chats:', error);
            }
        };

        fetchUserChats();
    }, [token]);

    const handleChatClick = (chat) => {
        setShowChat(chat);
        fetchMessages(chat);
    };

    return (
        <div className={styles.gridContainer}>
            <div className={styles.sidebar}>
                <a className={styles.sidebarText} href="/home">Back</a>
                {userChats ? (
                    userChats.map((chat) => (
                        <div className={styles.sidebarText} key={`${chat.other}-${chat.postID}`}>
                            <button onClick={() => handleChatClick(chat)}>
                                {chat.other} - {chat.postID}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No chats</p>
                )}
            </div>
            <div className={styles.header}>
                {showChat.other === "" ? (
                    <h1>Messages</h1>
                ) : (
                    <h1>
                        <Link className={styles.text} to={`/profile/${showChat.other}`}>{showChat.other}</Link> - {showChat.postID}
                    </h1>
                )}
            </div>

            {showChat.other === "" ? (
                <div className={styles.mainPage}>
                    <div className={styles.messages}>
                        <p>Click on a username to access chat</p>
                    </div>
                </div>
            ) : (
                <div className={styles.mainPage}>
                    <div className={styles.messages}>
                        {messages.map((message) => (
                            <div key={message._id} className={styles.textbox}>
                                <h3 className={styles.text}>{message.sender}</h3>
                                <p className={styles.text}>{message.message}</p>
                                <p className={styles.text}>{new Date(message.createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                    <div className={styles.textBar}>
                        <form 
                            className={styles.textBarForm} 
                            onSubmit={handleMessage}
                            data-sender={token}
                            data-recipient={showChat.other}
                            data-postid={showChat.postID}
                        >
                            <textarea 
                                className={styles.textBarFormInputs}
                                name="messageInput"
                                row="2"
                                cols="40"
                                value={input} 
                                onChange={e => setInput(e.target.value)}
                                required
                            >
                            </textarea>
                            <button 
                                className={styles.textBarFormIputs} 
                                type="submit"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

