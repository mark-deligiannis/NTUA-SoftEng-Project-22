import React, { Component } from "react";

export default class Home extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          content: ""
        };
      }
    
    render() {
    return (
    <p>Home Sweet Home</p>
    
  );
}
}