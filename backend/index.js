const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.get('/api/example', (req, res) => {
  res.json({ message: 'This is an example API endpoint' });
});

const PORT = 5000; 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});