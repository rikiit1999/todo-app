const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const tasksRoute = require('./routes/tasksRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
// const PORT = 5000;
const PORT = process.env.PORT;
console.log('PORTTT: ', PORT);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/tasks', tasksRoute);
app.use('/api/auth', authRoutes);

// MongoDB connection
mongoose.connect('mongodb://localhost/todo-app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));