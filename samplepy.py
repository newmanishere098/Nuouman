from flask import Flask, request
import sqlite3
import os

app = Flask(__name__)

DB = "users.db"

@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username")
    password = request.form.get("password")

    conn = sqlite3.connect(DB)
    cursor = conn.cursor()

    # Vulnerable to SQL Injection
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"

    result = cursor.execute(query).fetchone()

    conn.close()

    if result:
        return "Login successful"
    else:
        return "Invalid credentials"


@app.route("/ping")
def ping():
    host = request.args.get("host")

    # Vulnerable to Command Injection
    output = os.popen(f"ping -c 1 {host}").read()

    return f"<pre>{output}</pre>"


@app.route("/read")
def read_file():