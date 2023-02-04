import logo from "../public/IntelliQ_logo_draft_2.svg";
import './App.css';
import { useState} from 'react';

function App() {

  return (
    
    <div class="container">
      <h1>IntelliQ</h1>
      
      <h2>Our questions, your answers</h2>
      <h2>Log in:</h2>
      <div class="buttons">
        <button class="button" onclick="window.location.href='/admin'">Administrator</button>
        <button class="button" onclick="window.location.href='/user'">User</button>
      </div>
    </div>
  );
}

export default App;
