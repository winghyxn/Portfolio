// Profile.js
import React, { useState, useEffect } from 'react';
import Sidebar from "../components/sidebar.js";
import formStyles from "../components/form.module.css";
import './Home.css';

export default function Profile() {
  const [showForm, setShowForm] = useState(false);
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Clear previous error

    try {
      const response = await fetch("http://localhost:8080/my-profile", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputs)
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        setShowForm(false);
        fetchProfile(); // Fetch updated profile data
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Request failed:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:8080/my-profile');
      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
        setInputs(profileData); // Update form inputs with fetched data
      } else {
        console.error('Failed to fetch profile:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []); // Fetch profile data on component mount

  return (
    <div className="grid-container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="header">
        <h1>My Profile</h1>
      </div>
      {showForm ? (
        <div className="main-page">
          <form className={formStyles.form} onSubmit={handleSubmit}>
            <label className={formStyles.label}>Email:
              <input
                type="email"
                name="email"
                value={profile.email || ""}
                readOnly // Email should not be editable
              />
            </label>
            <label className={formStyles.label}>Year:
              <input
                type="number"
                name="year"
                value={inputs.year || ""}
                onChange={handleChange}
                className={formStyles.inputs}
              />
            </label>
            <label className={formStyles.label}>Major:
              <input
                type="text"
                name="major"
                value={inputs.major || ""}
                onChange={handleChange}
                className={formStyles.inputs}
              />
            </label>
            <label className={formStyles.label}>Description of yourself:
              <input
                type="text"
                name="description"
                value={inputs.description || ""}
                onChange={handleChange}
                className={formStyles.inputs}
              />
            </label>
            <input type="submit" value="Save Changes" />
          </form>
          {error && <p id="text1" style={{ color: 'red' }}>{error}</p>}
          <div className="button1">
            <button className="button1" onClick={() => setShowForm(false)}>
              Back
            </button>
          </div>
        </div>
      ) : (
        <div className="main-page">
          <div className="content-box">
            <p className="content-text">Username: {profile.username}</p>
            <p className="content-text">Year: {profile.year}</p>
            <p className="content-text">Major: {profile.major}</p>
            <p className="content-text">Description: {profile.description}</p>
            <p className="content-text">Review score: </p>
          </div>
          <div className="button1">
            <button onClick={() => setShowForm(true)}>
              Edit profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

