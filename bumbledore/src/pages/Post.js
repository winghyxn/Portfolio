import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/sidebar'; // Adjust the path as needed
import './Home.css';
import formStyles from '../components/form.module.css';

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
            description,
            pay: typeOfRequest === 'lookingForTutor' ? `${pay}/h` : undefined,
            numGroupmates: typeOfRequest === 'lookingForGroupmate' ? numGroupmates : undefined,
        };

        try {
            const response = await axios.post('http://localhost:8080/create-post', postData);
            if (response.status === 200) {
                console.log('Post created successfully:', response.data);
                // Clear form fields after successful post
                setTypeOfRequest('');
                setCourseCode('');
                setPay('');
                setNumGroupmates('');
                setDescription('');
                setCharCount(0);
                // Show success message
                alert('Post created successfully!');
            } else {
                console.error('Failed to create post: Status code:', response.status);
                alert('Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post');
        }
    };

    return (
        <div className="grid-container">
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="header">
                <h1>Post</h1>
            </div>
            <div className="main-page">
                <form className={formStyles.form} onSubmit={handleSubmit}>
                    <div>
                        <label className={formStyles.label} htmlFor="typeOfRequest">Type of Request:</label>
                        <select
                            id="typeOfRequest"
                            value={typeOfRequest}
                            onChange={handleTypeChange}
                            className={formStyles.inputs}
                        >
                            <option value="">Select</option>
                            <option value="lookingForTutor">Looking for Tutor</option>
                            <option value="lookingForGroupmate">Looking for Groupmate</option>
                        </select>
                    </div>
                    <div>
                        <label className={formStyles.label} htmlFor="courseCode">Course Code:</label>
                        <input
                            type="text"
                            id="courseCode"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                            className={formStyles.inputs}
                        />
                    </div>
                    {typeOfRequest === 'lookingForTutor' && (
                        <div>
                            <label className={formStyles.label} htmlFor="pay">Pay:</label>
                            <div>
                                <span>$</span>
                                <input
                                    type="number"
                                    id="pay"
                                    value={pay}
                                    onChange={(e) => setPay(e.target.value)}
                                    className={formStyles.inputs}
                                />
                                <span>/h</span>
                            </div>
                        </div>
                    )}
                    {typeOfRequest === 'lookingForGroupmate' && (
                        <div>
                            <label className={formStyles.label} htmlFor="numGroupmates">Number of Groupmates Needed:</label>
                            <input
                                type="number"
                                id="numGroupmates"
                                value={numGroupmates}
                                onChange={(e) => setNumGroupmates(e.target.value)}
                                className={formStyles.inputs}
                            />
                        </div>
                    )}
                    <div>
                        <label className={formStyles.label} htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={handleDescriptionChange}
                            className={formStyles.inputs}
                        />
                        <div>
                            {charCount} / 2000 characters
                        </div>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}
