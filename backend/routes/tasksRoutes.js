const express = require('express');
const Task = require('../models/task.model');

const router = express.Router();

// GET all tasks
router.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// POST create a new task
router.post('/', async (req, res) => {
  const { description, category, dueDate } = req.body;
  const newTask = new Task({ description, category, dueDate });
  await newTask.save();
  res.json(newTask);
});

// PUT update a task
router.put('/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.isCompleted = !task.isCompleted;
  await task.save();
  res.json(task);
});

// DELETE a task
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

module.exports = router;