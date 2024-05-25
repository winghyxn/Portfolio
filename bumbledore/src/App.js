import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Login.js";
import Home from "./Home.js";
import CreateAccount from './CreateAccount';
//import PrivateRoute from './PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <section>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path = "/home" element = {<Home />} />
        </Routes>
      </section>
    </Router>
  );
}

export default App;

