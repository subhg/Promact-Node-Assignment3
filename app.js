// index.js
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'create.html'));
});

app.get('/users', (req, res) => {
  const usersFilePath = path.join(__dirname, 'users.txt');

  // Read the users from the text file using fs.readFile
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading users.txt:', err.message);
      res.status(500).send('Internal Server Error');
      return;
    }

    console.log('Raw content read from file:', data);

    // Split the content into an array of usernames
    const users = data.split('\n').filter(Boolean);

    console.log('Parsed user array:', users);

    // Construct the HTML string directly
    const userListHTML = `
      <h2>Users</h2>
      <ul>
        ${users.map(user => `<li>${user}</li>`).join('')}
      </ul>
    `;

    // Send the HTML string as the response
    res.send(userListHTML);
  });
});

// Handle form submission and store username in a text file
app.post('/add', (req, res) => {
  const { userName } = req.body;

  // Append the username to a text file (you can modify this part as needed)
  const usersFilePath = path.join(__dirname, 'users.txt');
  fs.appendFileSync(usersFilePath, `${userName}\n`);

  // Redirect to the users page after adding the user
  res.redirect('/users');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
