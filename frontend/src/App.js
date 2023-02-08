import React, {Component} from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Admin from "./Components/admin_components/Admin";
import User from "./Components/user_components/User";
import Home from "./Components/home"

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
      this.setState({});
  }


  render(){
  return (
    
    
   
    <div class="container">
      <Router>
      <div>
        
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path={ "/Admin"} element={<Admin />} />
            <Route path={ "/User"} element={<User />} />
          </Routes> 
  
      </div>
      </Router>
    </div> 
  );}
}

export default App;
