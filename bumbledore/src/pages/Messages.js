import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useToken from "../components/useToken.js";
import styles from './Messages.module.css';

export default function Messages() {
    return (
        <div className={styles.gridContainer}>
            <div className={styles.sidebar}>
                <a href = "/home">Back</a>
                <p>messagesssssssssssssssssss</p>
            </div>
            <div className={styles.header}>
                <p>username</p>
            </div>
            <div className={styles.mainPage}>
                <p>texts</p>
            </div>
            <div className={styles.textBar}>
                <form className={styles.textBarForm}>
                    <textarea className={styles.textBarFormInputs} />
                    <button className={styles.textBarFormIputs} type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}