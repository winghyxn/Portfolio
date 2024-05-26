import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
    const [inputs, setInputs] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); // Clear previous error

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputs),
            });

            if (response.ok) {
                navigate('/home');
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (error) {
            console.error('Request failed:', error);
            setError('Failed to login. Please try again.');
        }
    }

    const handleCreateAccount = () => {
        navigate("/create-account");
    }

    return (
        <section>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>Email:  
                    <input 
                        type="email" 
                        name="email" 
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
                        value={inputs.password || ""} 
                        onChange={handleChange} 
                        required 
                    />
                </label>
                <br />
                <input type="submit" id="submit-button" />
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <br />
            <button id="create-account" onClick={handleCreateAccount}>Create Account</button>
        </section>
    );
}
