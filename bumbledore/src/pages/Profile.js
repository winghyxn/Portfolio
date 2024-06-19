import Sidebar from "../components/sidebar.js";
import './Home.css';

export default function Profile() {
    return (
        <div className = "grid-container">
            <div className = "sidebar">
                <Sidebar></Sidebar>
            </div>
            <div className = "header">
                <h1>My profile</h1>
            </div>
            <div className = "main-page">
                <div className = "content-box">
                    <p className = "content-text">Username: </p>
                    <p className = "content-text">Year: </p>
                    <p className = "content-text">Major: </p>
                    <p className = "content-text">Description of yourself: </p>
                    <p className = "content-text">Review score: </p>
                </div>
            </div>
        </div>
    );
}