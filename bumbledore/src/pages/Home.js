import Sidebar from "../components/sidebar.js";
import './Home.css';

export default function Home() {
    return (
        <div className = "grid-container">
            <div className = "sidebar">
                <Sidebar></Sidebar>
            </div>
            <div className = "header">
                <p>search bar</p>
            </div>
            <div className = "main-page">
                <p>feed</p>
            </div>
        </div>
    );
}