const mongoose = require('mongoose');

const user = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name!']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address!'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password!']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', user);