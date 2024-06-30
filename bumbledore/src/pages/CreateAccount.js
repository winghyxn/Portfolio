import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function CreateAccount() {
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Clear previous error

    try {
      const response = await fetch("https://bumbledore-server.vercel.app//create-account", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: inputs.email,
          password: inputs.password
        })
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Something went wrong');
      }

      navigate('/login'); // Redirect to login page after successful account creation
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div>
      <h1 className = "login-title">Bumbledore</h1>
      <div>
        <h2 className = "login-subtitle">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={inputs.email || ''}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={inputs.password || ''}
              onChange={handleChange}
              required
            />
          </label>
          <input type="submit" id="submit-button" value="Create Account" />
        </form>
      </div>
      <p id = "text1">Already have an account? <a href = "/login">Login</a></p>
      {error && <p id= "text1" style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

