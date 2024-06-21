import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Login.css';

async function Authentication(credentials) {
    return fetch("http://localhost:8080/login", {  //`${API_URL}/login`, {//fetch('', { https://bumbledore.vercel.app/login 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
    .then(data => data.json());
}

export default function Login({ setToken }) {
    const [inputs, setInputs] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    //const API_URL = process.env.REACT_APP_API_URL;

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); // Clear previous error
        const response = await Authentication(inputs);
        setToken(response);

        try {
            /*const response = await fetch("http://localhost:3000/login", {  //`${API_URL}/login`, {//fetch('', { https://bumbledore.vercel.app/login 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputs)
            });*/
            const response = await Authentication(inputs);
            setToken(response);
            navigate('/home')

            /*if (response.ok) {
                navigate('/home');
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            } */
        } catch (error) {
            console.error('Request failed:', error);
            setError('Failed to login. Please try again.');
        }
    }

    return (
        <section>
            <h1 className = "login-title">Bumbledore</h1>
            <container>
            <h2 className = "login-subtitle">Login</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:  </label>
                    <input 
                        type="email" 
                        name="email" 
                        value={inputs.email || ""} 
                        onChange={handleChange} 
                        required 
                    />
                <br />
                <label>Password:  </label>
                    <input 
                        type="password" 
                        name="password" 
                        value={inputs.password || ""} 
                        onChange={handleChange} 
                        required 
                    />
                <br />
                <input type="submit" id="submit-button" value="Login" />
            </form>
            </container>
            <p id = "text1">Don't have an account? <a href = "/create-account">Create Account</a></p>
            {error && <p id= "text1" style={{ color: 'red' }}>{error}</p>}
        </section>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};
