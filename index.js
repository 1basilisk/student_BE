// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
connectDB();

// Enable CORS for all origins
app.use(cors());

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/student'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
