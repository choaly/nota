const express = require('express');
const User = require('../models/User');
const Note = require('../models/Note');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/auth');

const authRouter = express.Router();

authRouter.post('/signup', async (req,res) => {
    try {
        if (await User.findOne({ email: req.body.email })) {
            return res.status(400).json({message: "User with that email already exists"});
        }

        const newUser = await User.create({
            email: req.body.email,
            password: req.body.password
        }); //models/User.js pre-save hook handles hashing automatically

        //after creating the user, generate a token and include it in the response
        /* 
            First arg: the payload (what data to embed in the token)
            Second arg: your secret key
            Third arg: options — expiresIn: '7d' means the token is valid for 7 days
        */
       const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            id: newUser._id,
            email: newUser.email,
            displayName: newUser.displayName,
            token: token
        });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email});
        if (!user) {
            //Security note: for both "user not found" and "wrong password", return the same generic message like "Invalid credentials". If you say "no account with that email", an attacker learns which emails are registered.
            return res.status(401).json({ message: "Invalid credentials"});
        }

        if ( !await bcrypt.compare(req.body.password, user.password)) {
            return res.status(401).json({ message: "Invalid credentials"});
        }

        //after verifying credentials, generate a token and include it in the response
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({
            id: user._id,
            email: user.email,
            displayName: user.displayName,
            token: token
        });
    } catch(error) {
        res.status(500).json({ message: error.message});
    }
});


// Update profile (email and/or display name)
authRouter.put('/profile', authenticate, async (req, res) => {
    try {
        const { email, displayName } = req.body;
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (email && email !== user.email) {
            const existing = await User.findOne({ email });
            if (existing) return res.status(400).json({ message: 'Email is already in use' });
            user.email = email;
        }

        if (displayName !== undefined) {
            user.displayName = displayName;
        }

        await user.save();

        res.json({ id: user._id, email: user.email, displayName: user.displayName });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Change password (requires authentication)
authRouter.put('/password', authenticate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

        user.password = newPassword; // pre-save hook will hash it
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete account and all associated notes (requires authentication)
authRouter.delete('/account', authenticate, async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: 'Password is required to delete account' });
        }

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Password is incorrect' });

        await Note.deleteMany({ user: req.userId });
        await User.findByIdAndDelete(req.userId);

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = authRouter;