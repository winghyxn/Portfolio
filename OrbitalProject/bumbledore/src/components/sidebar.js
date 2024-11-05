import styles from "./sidebar.module.css";

export default function Sidebar() {
    return (
        <div className = {styles.menu}>
            <h1 className = {styles.title}>Bumbledore</h1>
            <div className = {styles.items}> 
                <a href = "/home">Feed</a>
                <br></br>
                <a href = "/post">Post</a>
                <br></br>
                <a href = "/messages">Direct Messages</a>
                <br></br>
                <a href = "/my-posts">My Posts</a>
                <br></br>
                <a href = "/my-applications">My Applications</a>
                <br></br>
                <a href = "/profile">My Profile</a>
            </div>
        </div>
    );
}
