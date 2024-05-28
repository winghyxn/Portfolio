/*const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://kweyne:tfaoAz9bCAuXWwpD@orbital.fmsrize.mongodb.net/?retryWrites=true&w=majority&appName=orbital"
const client = new MongoClient(uri);

async function run() {
    try {
        // Connect to the Atlas cluster
         await client.connect();
         // Get the database and collection on which to run the operation
         const db = client.db("bumbledore");
         const col = db.collection("userAccountInfo");
         // Create new documents                                                                                                                                         
         const userAccountInfoDocuments = [
           {
             "email": "hello123@gmail.com",
             "password": "qwertyuiop"
           },
           {
            "email": "hello321@gmail.com",
            "password": "asdfghjkl"
           }
         ]
         // Insert the documents into the specified collection        
         const p = await col.insertMany(userAccountInfoDocuments);
         // Find the document
         const filter = { "email": "hello123@gmail.com" };
         const document = await col.findOne(filter);
         // Print results
         console.log("Document found:\n" + JSON.stringify(document));
        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}
run().catch(console.dir);
*/

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
            const response = await fetch('http://localhost:3001/create-account', {
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
            <br></br>
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
            <p>Already have an account? <a href = "/">Log in</a></p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </section>
    );
}
