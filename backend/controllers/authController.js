const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username is already taken
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: 'Username already taken' });

        // Hash the password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user object with isAdmin set based on the credentials
        user = new User({
            username,
            password: hashedPassword            
        });

        await user.save();

        const payload = {
            user: { id: user.id }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('JWT_SECRET: ', process.env.JWT_SECRET);
        console.log('token: ', token);

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Login a user
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};