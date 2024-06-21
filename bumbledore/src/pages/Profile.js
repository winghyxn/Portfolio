import { useState } from 'react';
import Sidebar from "../components/sidebar.js";
import './Home.css';

export default function Profile() {
    const [showForm, setShowForm] = useState(false);
    const [inputs, setInputs] = useState({});
    const [error, setError] = useState(null);
    //const API_URL = process.env.REACT_APP_API_URL;

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); // Clear previous error

        try {
            const response = await fetch("http://localhost:8080/my-profile", { //`${API_URL}/create-account`, {// , https://bumbledore.vercel.app/create-account 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputs)
            });

            if (response.ok) {
                alert('Profile created successfully!');
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (error) {
            console.error('Request failed:', error);
            setError('Failed to create profile. Please try again.');
        }
    }


    return (
        <div className = "grid-container">
            <div className = "sidebar">
                <Sidebar></Sidebar>
            </div>
            <div className = "header">
                <h1>My profile</h1>
            </div>
            {showForm 
                ? 
                <div className = "main-page">
                    <div className = "content-box">
                        <form onSubmit = {handleSubmit}>
                            <label>Email: 
                                <input 
                                    type = "email"
                                    name = "email"
                                    value = {inputs.email || ""}
                                    onChange = {handleChange}></input>
                            </label>
                            <label>Year: 
                                <input 
                                    type = "number"
                                    name = "year"
                                    value = {inputs.year || ""}
                                    onChange = {handleChange}></input>
                            </label>
                            <label>Major: 
                                <input 
                                    type = "text" 
                                    name = "major"
                                    value = {inputs.major || ""}
                                    onChange = {handleChange}>
                                </input>
                            </label>
                            <label>Description of yourself: 
                                <input 
                                    type = "text" 
                                    name = "description"
                                    value = {inputs.description || ""}
                                    onChange = {handleChange}>
                                </input>
                            </label>
                            <input type="submit" value="Edit Profile" />
                        </form>
                        {error && <p id = "text1" style={{ color: 'red' }}>{error}</p>}
                    </div>
                    <div className = "button1">
                        <button className = "button1" onClick = {() => {setShowForm(false)}}>
                            Back
                        </button>
                    </div>
                </div>
                : 
                <div className = "main-page">
                    <div className = "content-box">
                        <p className = "content-text">Username: </p>
                        <p className = "content-text">Year: </p>
                        <p className = "content-text">Major: </p>
                        <p className = "content-text">Description of yourself: </p>
                        <p className = "content-text">Review score: </p>
                    </div>
                    <div className = "button1">
                        <button onClick = {() => {setShowForm(true)}}>
                            Edit profile
                        </button>
                    </div>
                </div>
            }
        </div>
    );
}
