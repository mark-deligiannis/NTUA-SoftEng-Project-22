import React, {Component} from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Admin from "./Components/admin_components/Admin";
import AdminGraphs from "./Components/admin_components/Admin_graphs";
import User from "./Components/user_components/User";
import AnswerQuestionnaire from "./Components/user_components/Answer_questionnaire";
import Home from "./Components/home"
import ViewSession from "./Components/user_components/View_session";

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
    
    
   
    <div className="container">

      <Router>
      <div>
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path={ "/Admin/*"} element={<Admin />} />
            {/*If you want a nested Route, like having a top page staying the same but the bottom 
            becoming different then you need this:

            <Route path={ "/Admin/*"} element={<Admin />} />

            This will make every /Admin/anything have at least Admin on the top
            If you want a Route for a different page eg Answer_questionnaire, you need something like this:
            
            <Route path={ "/User/Answer/:QuestionID"} element={<NameOfClass />} />

            and don't forget the import at the top :) */}
            <Route path={ "/User/Answer/:id"} element={<AnswerQuestionnaire />} />
            <Route path={ "/User/Answer/:id/:session"} element={<ViewSession />} />
            <Route path={ "/Admin/Graphs"} element={<AdminGraphs />} />
            <Route path={ "/User"} element={<User />} />
          </Routes> 
  
      </div>
      </Router>
    </div> 
  );}
}

export default App;
