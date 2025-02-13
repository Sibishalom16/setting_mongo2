require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { resolve } = require('path');
const User = require('./schema');

const app = express();
const port = 3010;

// Middleware
app.use(express.static('static'));
app.use(express.json()); // Enable JSON parsing

// MongoDB Connection
const mongoURI = "mongodb+srv://Sibi:Sibiraj@cluster0.mongodb.net/Sibi?retryWrites=true&w=majority";
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log("Connected to database"))
    .catch(err => console.error("Error connecting to database:", err));

// Serve HTML page
app.get('/', (req, res) => {
    res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// POST API to store user data
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});