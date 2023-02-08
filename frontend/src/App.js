import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Admin from "./Components/Admin";

function App() {
  return (
    
    <div class="container">
      <h1>IntelliQ</h1>
      
      <h2>Our questions, your answers</h2>
      <h2>Log in:</h2>
      <div class="buttons">
      <Link to={"/Admin"}>
                  Admin
                </Link>
        {/*<button class="button" onclick="window.location.href='/Admin'">Administrator</button>
        <button class="button" onclick="window.location.href='/User'">User</button> */}
      </div>
      <div>
        <Router>
          <Routes>
            <Route exact path={ "/Admin"} component={Admin} />
          </Routes>
          </Router>
      </div>
    </div>
  );
}

export default App;
