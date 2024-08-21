const express = require('express');
const Task = require('../models/task.model');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to authen JWT
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Đặt req.user bằng decoded (sẽ chứa id người dùng)
      next();
  } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
  }
};

// GET all tasks
router.get('/', auth, async (req, res) => {
  try {
      const tasks = await Task.find({ userId: req.user.id });
      res.json(tasks);
  } catch (err) {
      res.status(500).json({ msg: 'Server error' });
  }
});

// POST create a new task
router.post('/', auth, async (req, res) => {
  const { description, category, dueDate } = req.body;

  try {
      const newTask = new Task({
          description,
          category,
          dueDate,
          userId: req.user.id // Lấy userId từ token đã giải mã
      });

      await newTask.save();
      res.json(newTask);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

// PUT update a task
router.put('/:id', auth, async (req, res) => {
  try {
      const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
      if (!task) return res.status(404).json({ msg: 'Task not found' });
      
      task.isCompleted = !task.isCompleted;      

      await task.save();
      res.json(task);
  } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE a task for the authenticated user
router.delete('/:id', auth, async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!task) return res.status(404).json({ msg: 'Task not found' });

  res.json({ message: 'Task deleted' });
});

module.exports = router;