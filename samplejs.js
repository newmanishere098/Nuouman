



const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
app.use(express.json());

// Hardcoded credentials
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'appdb'
});

app.post('/login', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    // SQL Injection Vulnerability
    const query =
        "SELECT * FROM users WHERE username='" + username +
        "' AND password='" + password + "'";

    db.query(query, (err, results) => {

        if (err) {
            return res.send(err.message);
        }

        if (results.length > 0) {

            // Command Injection Vulnerability
            exec('ping ' + username, (error, stdout) => {
                console.log(stdout);
            });

            // Path Traversal Vulnerability
            fs.readFile('/tmp/' + username, 'utf8', (err, data) => {
                if (!err) {
                    console.log(data);
                }
            });

            res.send('Login successful');

        } else {
            res.send('Invalid credentials');
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});


