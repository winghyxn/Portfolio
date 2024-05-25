import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Login.js";
import CreateAccount from './CreateAccount';
import './App.css';

function App() {
  return (
    <Router>
      <section>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
        </Routes>
      </section>
    </Router>
  );
}

export default App;

