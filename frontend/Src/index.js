import React, { useState } from 'react';

const FirstPage = () => {
  const [message, setMessage] = useState('Hello, World!');

  return (
    <div>
      <h1>First Page</h1>
      <p>{message}</p>
      <button onClick={() => setMessage('Hello, React!')}>
        Update Message
      </button>
    </div>
  );
};

export default FirstPage;