import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export default class Home extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          content: ""
        };
      }
    
    render() {
    return (
      <p>Wlecome Home</p>
    
  );
}
}