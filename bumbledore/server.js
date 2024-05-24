const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();

app.use(cors());
const pool = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '!iLovesql69',
  database: 'myapp',
});