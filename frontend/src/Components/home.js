import React from "react";
import { Link } from 'react-router-dom';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          content: ""
        };
      }
    
    render() {
    return (
      <div>
      <h1>IntelliQ</h1>
      
      <h2>Our questions, your answers</h2>
      <h2>Log in:</h2>
      <div className="buttons">
        <Link to={"/Admin"}> <button className="button" >Administrator</button></Link>
        <Link to={"/User"}><button className="button" >User</button> </Link>
      </div>
      <p>Welcome Home</p>
      </div>
  );
}
}