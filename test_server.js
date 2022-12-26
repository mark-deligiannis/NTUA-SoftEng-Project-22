const express = require('express');
const app = express();
const port = 9103

app.get('/intelliq_api', (req, res) => {
  res.send('This is the api central page');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
