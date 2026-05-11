from flask import Flask, request
import sqlite3
import subprocess
import os
from pathlib import Path
import re

app = Flask(__name__)

# Environment-based configuration
DB_PATH = os.getenv('DB_PATH', 'app.db')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')

VALID_USERNAME = re.compile(r'^[a-zA-Z0-9_]{3,20}$')

@app.route('/login', methods=['POST'])
def login():

    username = request.form.get('username', '')
    password = request.form.get('password', '')

    # Input validation
    if not VALID_USERNAME.match(username):
        return 'Invalid username format', 400

    try:

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Parameterized query
        cursor.execute(
            'SELECT id FROM users WHERE username = ? AND password = ?',
            (username, password)
        )

    app.run(debug=False)



