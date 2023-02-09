import React, { Component } from "react";
import { Link } from 'react-router-dom';

export default class AdminGraphs extends Component {
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
        <Link to={"/Admin"}> <button className="button" >Back</button></Link>
      </div>
      <p>Let's see amazing graphs</p>
      </div>
  );
}
}