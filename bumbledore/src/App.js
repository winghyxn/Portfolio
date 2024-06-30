import { BrowserRouter, Route, Routes } from 'react-router-dom';
import useToken from './components/useToken.js';
import Login from "./pages/Login.js";
import Home from "./pages/Home.js";
import CreateAccount from './pages/CreateAccount.js';
import Post from './pages/Post.js';
import Messages from './pages/Messages.js';
import Profile from './pages/Profile.js';
import UserProfile from './pages/UserProfile.js'; // Import the new component
import Map from './pages/Map.js';
import './App.css';

function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route index element={<Login setToken={setToken} />} />
            <Route path="login" element={<Login setToken={setToken} />} />
            <Route path="/create-account" element={<CreateAccount />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/home" element={<Home />} />
          <Route path="/post" element={<Post />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/my-applications-posts" element={<Map />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<UserProfile />} /> {/* New route */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

