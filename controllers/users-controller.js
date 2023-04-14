const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/users');

const registerUser = asyncHandler(async (request, response) => {
  const { name, email, password } = request.body;

  // Check fields have value
  if (!name || !email || !password) {
    response.status(400);
    throw new Error('Please fill up all mandatory fields.');
  }

  // Check user exists
  const userExists = await User.findOne({email});

  if (userExists) {
    response.status(400);
    throw new Error('User already exists!');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({ name, email, password: hashedPassword });

  if (user) {
    response.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  }
  else {
    response.status(400);
    throw new Error('Invalid user data');
  }
});

const loginUser = asyncHandler(async (request, response) => {
  const { email, password } = request.body;
  
  // Check for user email
  const user = await User.findOne({email});

  if (user && (await bcrypt.compare(password, user.password))) {
    response.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  }
  else {
    response.status(400);
    throw new Error('Invalid credentials');
  }
});

const getUserData = asyncHandler(async (request, response) => {
  const { _id, name, email } = await User.findById(request.user.id);
  response.status(200).json({
    id: _id,
    name: name,
    email: email
  });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = {
  registerUser,
  loginUser,
  getUserData
}