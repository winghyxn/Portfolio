import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateAccount.css';

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
            const response = await fetch('http://localhost:3000/create-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inputs)
            });

            if (response.ok) {
                alert('Account created successfully!');
                navigate('/login');
            } else {
                const errorMessage = await response.text();
                setError(errorMessage);
            }
        } catch (error) {
            console.error('Request failed:', error);
            setError('Failed to create account. Please try again.');
        }
    }

    return (
        <section>
            <h1>Bumbledore</h1>
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:
                    <input
                        type="email"
                        name="email"
                        value={inputs.email || ""}
                        onChange={handleChange}
                        required />
                </label>
                <br />
                <label>Password:
                    <input
                        type="password"
                        name="password"
                        value={inputs.password || ""}
                        onChange={handleChange}
                        required />
                </label>
                <br />
                <input type="submit" id="submit-button" value="Create Account" />
            </form>
            <p>Already have an account? <a href = "/login">Log in</a></p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </section>
    );
}