import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Admin from "./Components/admin_components/Admin";
import AdminGraphs from "./Components/admin_components/Admin_graphs";
import AdminQuestionnaire from "./Components/admin_components/Admin_questionnaire";
import User from "./Components/user_components/User";
import AnswerQuestionnaire from "./Components/user_components/Answer_questionnaire";
import Home from "./Components/home"
import ViewSession from "./Components/user_components/View_session";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
      this.setState({});
  }

  render(){
  return (
    
    
   
    <div className="container">

      <Router>
      <>
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path={ "/Admin"} element={<Admin />} />
            <Route path={ "/Admin/Questionnaires"} element={<AdminQuestionnaire />} />
            <Route path={ "/Admin/Questionnaires/:id/Graphs"} element={<AdminGraphs />} />
            <Route path={ "/User/Answer/:id"} element={<AnswerQuestionnaire />} />
            <Route path={ "/User/Answer/:id/:session"} element={<ViewSession />} />
            <Route path={ "/User"} element={<User />} />
          </Routes> 
  
      </>
      </Router>
    </div> 
  );}
}

export default App;
