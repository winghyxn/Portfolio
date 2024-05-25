import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name] : value}));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        navigate('/home');
        //navigate("www.google.com");
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
                        type = "email" 
                        name = "email" 
                        value = {inputs.email || ""}
                        onChange = {handleChange}
                        required />
                </label>
                <br></br>
                <label>Password:  
                    <input 
                        type = "password" 
                        name = "password" 
                        value = {inputs.password || ""}
                        onChange = {handleChange}
                        required />
                </label>
                <br></br>
                <input type="submit" id="submit-button" />
            </form>
            <br></br>
            <button id = "create-account" onClick={handleCreateAccount}>Create Account</button>
        </section>
    );
}
