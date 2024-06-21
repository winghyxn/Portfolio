import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar'; // Adjust the path as needed
import styles from './Post.css';

export default function Post() {
    const [typeOfRequest, setTypeOfRequest] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [pay, setPay] = useState('');
    const [numGroupmates, setNumGroupmates] = useState('');
    const [description, setDescription] = useState('');
    const [charCount, setCharCount] = useState(0);

    const handleTypeChange = (e) => {
        setTypeOfRequest(e.target.value);
        // Clear other fields when type changes
        setPay('');
        setNumGroupmates('');
    };

    const handleDescriptionChange = (e) => {
        const text = e.target.value;
        if (text.length <= 2000) {
            setDescription(text);
            setCharCount(text.length);
            adjustTextareaHeight(e.target);
        }
    };

    const adjustTextareaHeight = (textarea) => {
        textarea.style.height = 'auto'; // Reset height
        textarea.style.height = textarea.scrollHeight + 'px'; // Set to scroll height
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = {
            typeOfRequest,
            courseCode,
            pay: typeOfRequest === 'lookingForTutor' ? `${pay}/h` : undefined,
            numGroupmates: typeOfRequest === 'lookingForGroupmate' ? numGroupmates : undefined,
            description,
        };

        try {
            const response = await axios.post('http://localhost:8080/posts', postData);
            console.log('Post created:', response.data);
            // Clear form fields after successful post
            setTypeOfRequest('');
            setCourseCode('');
            setPay('');
            setNumGroupmates('');
            setDescription('');
            setCharCount(0);
            // Handle successful post (e.g., show success message)
        } catch (error) {
            console.error('Failed to create post:', error);
            // Handle error (e.g., show error message)
        }
    };

    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.postContainer}>
                <h2>Create a Post</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="typeOfRequest">Type of Request:</label>
                        <select
                            id="typeOfRequest"
                            value={typeOfRequest}
                            onChange={handleTypeChange}
                        >
                            <option value="">Select</option>
                            <option value="lookingForTutor">Looking for Tutor</option>
                            <option value="lookingForGroupmate">Looking for Groupmate</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="courseCode">Course Code:</label>
                        <input
                            type="text"
                            id="courseCode"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                        />
                    </div>
                    {typeOfRequest === 'lookingForTutor' && (
                        <div className={styles.formGroup}>
                            <label htmlFor="pay">Pay:</label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.prefix}>$</span>
                                <input
                                    type="number"
                                    id="pay"
                                    value={pay}
                                    onChange={(e) => setPay(e.target.value)}
                                    className={styles.inputWithSuffix}
                                />
                                <span className={styles.suffix}>/h</span>
                            </div>
                        </div>
                    )}
                    {typeOfRequest === 'lookingForGroupmate' && (
                        <div className={styles.formGroup}>
                            <label htmlFor="numGroupmates">Number of Groupmates Needed:</label>
                            <input
                                type="number"
                                id="numGroupmates"
                                value={numGroupmates}
                                onChange={(e) => setNumGroupmates(e.target.value)}
                            />
                        </div>
                    )}
                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={handleDescriptionChange}
                            className={styles.textarea}
                        />
                        <div className={styles.charCount}>
                            {charCount} / 2000 characters
                        </div>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

