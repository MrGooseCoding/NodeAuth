const express = require('express');
const app = express();
const api = require('./api/urls.js'); // Import the user routes

app.use(express.json())
app.use('/api', api);

// Add more route files as needed

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app