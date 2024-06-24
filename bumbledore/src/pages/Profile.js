import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../components/sidebar.js";
import formStyles from "../components/form.module.css";
import useToken from "../components/useToken.js";
import './Home.css';

export default function Profile() {
    const [showForm, setShowForm] = useState(false);
    const [inputs, setInputs] = useState({});
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState([])
    const {token, setToken} = useToken();

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
                alert('Profile edited successfully!');
                setShowForm(false);
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (error) {
            console.error('Request failed:', error);
            setError('Failed to create profile. Please try again.');
        }
    }

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8080/profile',
                    {params: { token: token }}
            );
                setProfile(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };

        fetchProfile();
    }, []);

// change the username {token} part to the actual username when it gets included in database
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
                    <form className = {formStyles.form} onSubmit = {handleSubmit}>
                        <label className = {formStyles.label}>Email: 
                            <input 
                                type = "email"
                                name = "email"
                                value = {inputs.email || ""}
                                onChange = {handleChange}></input>
                        </label>
                        <label className = {formStyles.label}>Year: 
                            <input 
                                type = "number"
                                name = "year"
                                value = {inputs.year || ""}
                                onChange = {handleChange}
                                className = {formStyles.inputs} />
                        </label>
                        <label className = {formStyles.label}>Major: 
                            <input 
                                type = "text" 
                                name = "major"
                                value = {inputs.major || ""}
                                onChange = {handleChange}
                                className = {formStyles.inputs} />
                        </label>
                        <label className = {formStyles.label}>Description of yourself: 
                            <input 
                                type = "text" 
                                name = "description"
                                value = {inputs.description || ""}
                                onChange = {handleChange}
                                className = {formStyles.inputs} />
                        </label>
                        <input type="submit" value="Edit Profile"/>
                    </form>
                    {error && <p id = "text1" style={{ color: 'red' }}>{error}</p>}
                    <div className = "button1">
                        <button className = "button1" onClick = {() => {setShowForm(false)}}>
                            Back
                        </button>
                    </div>
                </div>
                : 
                <div className = "main-page">
                    {profile == []
                    ? profile.map((p) =>
                        <div key = {p._id} className = "content-box">
                            <p className = "content-text">Username: {token} </p> 
                            <p className = "content-text">Year: {p.year} </p>
                            <p className = "content-text">Major: {p.major} </p>
                            <p className = "content-text">Description of yourself: {p.description} </p>
                            <p className = "content-text">Review score: 0000</p>
                        </div>
                    )
                    : 
                    <div className = "content-box">
                        <p className = "content-text">Username: {token} </p> 
                        <p className = "content-text">Year: </p>
                        <p className = "content-text">Major: </p>
                        <p className = "content-text">Description of yourself: </p>
                        <p className = "content-text">Review score: </p>
                    </div>
                    }
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
