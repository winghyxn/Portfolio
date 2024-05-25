import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateAccount.css';

export default function CreateAccount() {
    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('http://localhost:3001/create-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputs)
        });

        if (response.ok) {
            alert('Account created successfully!');
            navigate('/home');
        } else {
            alert('Failed to create account.');
        }
    }

    return (
        <section>
            <h1>Create Account</h1>
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
        </section>
    );
}
