import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import formStyles from "../components/form.module.css";
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
      const response = await fetch("http://localhost:8080/create-account", {
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
    <form onSubmit={handleSubmit} className={formStyles.form}>
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
      {error && <div className="error">{error}</div>}
      <button type="submit">Create Account</button>
    </form>
  );
}
