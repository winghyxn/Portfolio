import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useToken from "../components/useToken.js";
import styles from './Messages.module.css';

export default function Messages() {
    const [userChats, setUserChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [showChat, setShowChat] = useState("");
    const [input, setInput] = useState("");
    const { token } = useToken();

    const handleMessage = async (e) => {
        e.preventDefault();
        const sender = e.target.dataset.sender;
        const recipient = e.target.dataset.recipient;
        
        const messageData = {
            sender: sender,
            recipient: recipient,
            message: input
        };

        try {
            const response = await axios.post('https://bumbledore-server.vercel.app/messages', messageData);
            if (response.status === 200) {
                console.log('Message sent:', response.data);
                fetchMessages(showChat);
            } 
        } catch (error) {
            console.error("Failed to send message", error);
        }
        setInput('');
    };

    const fetchMessages = async (chat) => {
        try {
            const response = await axios.get(`https://bumbledore-server.vercel.app/messages?sender=${token}&&recipient=${chat}`);
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
                console.log('Fetched chats:', response.data);
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
                <a className={styles.sidebarText} href = "/home">Back</a>
                {userChats.chats ? (
                    userChats.chats.map((chat) => (
                        <div className={styles.sidebarText} key={chat}>
                            <button onClick={() => handleChatClick(chat)}>
                                {chat}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No chats</p>
                )}
            </div>
            <div className={styles.header}>
                {showChat === "" ? (
                    <h1>Messages</h1>
                ) : (
                    <h1>{showChat}</h1>
                )}
            </div>
            
            {showChat === "" ? (
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
                            data-recipient={showChat}
                        >
                            <textarea 
                                className={styles.textBarFormInputs}                                    name="messageInput"
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
