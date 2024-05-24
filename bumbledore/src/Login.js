import { useState } from 'react';
import './Login.css';

export default function Login() {
    const [inputs, setInputs] = useState({});
    //const history = useHistory();dd

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name] : value}));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        alert("submitted!")
        //navigate("www.google.com");
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
            <input type="submit" id="submit-button"></input>
        </form>
        </section>
    )
}