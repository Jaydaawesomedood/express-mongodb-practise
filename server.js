const express = require('express');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/error-middleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/goals', require('./routes/goals-route'));
app.use('/api/users', require('./routes/users-route'));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening to port ${port}`)
});