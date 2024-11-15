const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.get('/api/dashboard', (req, res) => {
  res.send({ data: 'Dashboard data' });
});

app.get('/api/practice', (req, res) => {
  res.send({ data: 'Practice problems' });
});

app.get('/api/progress', (req, res) => {
  res.send({ data: 'User progress' });
});

app.post('/api/progress', (req, res) => {
  const progress = req.body;
  // Save progress to the database
  res.send({ status: 'Progress saved' });
});

app.post('/api/solution', (req, res) => {
  const solution = req.body;
  // Save solution to the database
  res.send({ status: 'Solution submitted' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});