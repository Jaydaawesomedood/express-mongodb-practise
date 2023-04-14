const asyncHandler = require('express-async-handler');
const Goal = require('../models/goals');
const User = require('../models/users');

const getGoals = asyncHandler(async (request, response) => {
  const goals = await Goal.find({ user: request.user.id });
  response.status(200).json(goals);
});

const setGoals = asyncHandler(async (request, response) => {
  if (!request.body.text) {
    response.status(400);
    throw new Error('No text property found.');
  }

  const goal = await Goal.create({ 
    text: request.body.text,
    user: request.user.id
  });
  response.status(200).json(goal);
});

const updateGoals = asyncHandler(async (request, response) => {
  const goal = await Goal.findById(request.params.id);
  
  if (!goal) {
    response.status(400);
    throw new Error('Goal not found.');
  }

  const user = await User.findById(request.user.id);

  if (!user) {
    response.status(401);
    throw new Error('User not found!');
  }

  if (goal.user.toString() !== user.id) {
    response.status(401);
    throw new Error('User not authorized!');
  }

  const updatedGoal = await Goal.findByIdAndUpdate(request.params.id, request.body, { new: true });
  response.status(200).json(updatedGoal);
});

const deleteGoals = asyncHandler(async (request, response) => {
  const goal = await Goal.findOne({ _id: request.params.id });
  const user = await User.findById(request.user.id);

  if (!user) {
    response.status(401);
    throw new Error('User not found!');
  }
  
  if (goal.user.toString() !== user.id) {
    response.status(401);
    throw new Error('User not authorized!');
  }
  
  await Goal.deleteOne({ _id: request.params.id });
  response.status(200).json({ id: request.params.id });
});

module.exports = {
  getGoals,
  setGoals,
  updateGoals,
  deleteGoals
}