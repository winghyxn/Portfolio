import React, { useState, useTransition } from 'react';
import useToken from "../components/useToken.js";
import formStyles from "../components/form.module.css";
import axios from 'axios';
import PropTypes from 'prop-types';

export default function EditProfileForm({ onSubmit }) {
    const [inputs, setInputs] = useState({});
    const { token } = useToken();

    const [isPending, setPending] = useState(false);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
      };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setPending(true);

        try {
            const data = {
                username: token,
                year: inputs.year,
                major: inputs.major,
                description: inputs.description
            }
            const response = await axios.post("https://bumbledore-server.vercel.app/my-profile", data);
    
            if (response.status === 200) {
                onSubmit(response.data);
            } else {
                console.error('Failed to edit profile: Status code:', response.status);
                alert('Failed to edit profile');}
        } catch (error) {
            console.error("Failed to edit profile: ", error);
            alert('Failed to edit profile');
        }
        setPending(false);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className={formStyles.form}>
                <label className={formStyles.label}>
                Year:
                <input
                    type="text"
                    name="year"
                    value={inputs.year || ''}
                    onChange={handleChange}
                    className={formStyles.inputs}
                />
                </label>
                <label className={formStyles.label}>
                Major:
                <input
                    type="text"
                    name="major"
                    value={inputs.major || ''}
                    onChange={handleChange}
                    className={formStyles.inputs}
                />
                </label>
                <label className={formStyles.label}>
                Description:
                <input
                    type="text"
                    name="description"
                    value={inputs.description || ''}
                    onChange={handleChange}
                    className={formStyles.inputs}
                />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

EditProfileForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };
  