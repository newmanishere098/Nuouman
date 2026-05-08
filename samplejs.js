const express = require('express');
const mysql = require('mysql2/promise');
const fs = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
app.use(express.json());

// Environment-based credentials
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const VALID_USERNAME = /^[a-zA-Z0-9_]{3,20}$/;

app.post('/login', async (req, res) => {

    try {

        const username = req.body.username;
        const password = req.body.password;

        // Input validation
        if (!VALID_USERNAME.test(username)) {
            return res.status(400).send('Invalid username format');
        }

        const connection = await mysql.createConnection(dbConfig);

        // Parameterized query
        const [rows] = await connection.execute(
            'SELECT id FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        if (rows.length > 0) {

            // Safe command execution
            const child = spawn('ping', ['127.0.0.1']);

            child.stdout.on('data', (data) => {
                console.log(data.toString());
            });

            // Safe file access
            const basePath = path.resolve('/tmp/appdata');
            const requestedFile = path.resolve(basePath, username + '.txt');

            if (!requestedFile.startsWith(basePath)) {
                return res.status(403).send('Access denied');
            }

            try {
                const data = await fs.readFile(requestedFile, 'utf8');
                console.log(data);
            } catch (err) {
                console.log('File not found');
            }

            res.send('Login successful');

        } else {
});