import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import './Login.css';

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
        setError(null); 

        try {
            /*const response = await fetch("http://localhost:3000/login", {  //`${API_URL}/login`, {//fetch('', { https://bumbledore.vercel.app/login 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputs)
            });*/
            const data = {
                email: inputs.email,
                password: inputs.password
            }
            const response = await axios.post("https://bumbledore-server.vercel.app/login", data);
            setToken(response.data);

            if (response.status === '200') {
                navigate('/home');
            }

        } catch (error) {
            setError(error.response.data.error);
            console.error('Request failed:', error);
        }
    }

    return (
        <section>
            <h1 className = "login-title">Bumbledore</h1>
            <div>
            <h2 className = "login-subtitle">Login</h2>
            <form aria-label="login-form" onSubmit={handleSubmit}>
                <label>Email:  
                    <input 
                        type="email" 
                        name="email" 
                        data-testid="email-login"
                        value={inputs.email || ""} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <br />
                <label>Password:  
                    <input 
                        type="password" 
                        name="password" 
                        data-testid="password-login"
                        value={inputs.password || ""} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <br />
                <input type="submit" id="submit-button" name="Login" value="Login" />
            </form>
            </div>
            <p id = "text1">Don't have an account? <a href = "/create-account">Create Account</a></p>
            {error && <p id= "text1" style={{ color: 'red' }}>{error}</p>}
        </section>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};
