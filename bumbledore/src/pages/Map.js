import Sidebar from "../components/sidebar.js";
import './Home.css';

export default function Map() {
    return (
        <div className = "grid-container">
            <div className = "sidebar">
                <Sidebar></Sidebar>
            </div>
            <div className = "header">
                <h1>My applications/posts</h1>
            </div>
            <div className = "main-page">
                <div className = "content-box">
                    <p className = "content-text">wahwah </p>
                </div>
            </div>
        </div>
    );
}