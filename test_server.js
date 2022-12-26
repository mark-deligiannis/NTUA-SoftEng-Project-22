const express = require('express');
const app = express();
const port = 9103

app.get('/intelliq_api', (req, res) => {
  res.send('This is the api central page');
});

app.get('/error', (req, res) => {
  res.status(404).send('Error 404 message');
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
