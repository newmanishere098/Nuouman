import express, { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';

const app = express();
app.use(express.json());

// Environment-based configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const VALID_USERNAME = /^[a-zA-Z0-9_]{3,20}$/;

app.post('/login', async (req: Request, res: Response) => {

    try {

        const username: string = req.body.username;
        const password: string = req.body.password;

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

        if ((rows as any[]).length > 0) {

            // Safe process execution
            const child = spawn('ping', ['127.0.0.1']);

            child.stdout.on('data', (data: Buffer) => {
                console.log(data.toString());
            });

            // Safe path validation
            const basePath = path.resolve('/tmp/appdata');
            const requestedFile = path.resolve(basePath, username + '.txt');

            if (!requestedFile.startsWith(basePath)) {
                return res.status(403).send('Access denied');
            }

            try {
                const data = await fs.readFile(requestedFile, 'utf8');
                console.log(data);
            } catch {
                console.log('File not found');
            }

            res.send('Login successful');

        } else {
            res.status(401).send('Invalid credentials');
        }

});