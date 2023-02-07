import './App.css';

function App() {
  return (
    
    <div class="container">
      <h1>IntelliQ</h1>
      
      <h2>Our questions, your answers</h2>
      <h2>Log in:</h2>
      <div class="buttons">
        <button class="button" onclick="window.location.href='/Components/Admin'">Administrator</button>
        <button class="button" onclick="window.location.href='/Components/User'">User</button>
      </div>
    </div>
  );
}

export default App;
