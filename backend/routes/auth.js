const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();


router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        console.log('Received registration data:', { username, email, password, role });

        
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: 'Please provide all required fields: username, email, password, role' });
        }

        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already exists' });
        }

       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,  
        });

       
        await newUser.save();

       
        const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

       
        res.status(201).json({
            message: 'User registered successfully',
            token,
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error, please try again' });
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;


    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide both username and password' });
    }

    

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Username' });
        }

          

        
        const isMatch = await bcrypt.compare(password,user.password);
        
        if (!isMatch) {
            console.log(`Password comparison failed for user: ${username}`);
            
            return res.status(400).json({ message: 'Invalid Password' });
        }

        
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });


        
        res.json({ token });
    } catch (error) {
        
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error, please try again' });
    }
});

// Middleware for role-based access control
const authorize = (roles) => {
    return (req, res, next) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(403).json({ message: 'Access denied' });
  
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
  
        if (!roles.includes(decoded.role)) return res.status(403).json({ message: 'Permission denied' });
        req.user = decoded;
        next();
      });
    };
  };
  
  router.get('/user', authorize(['admin', 'teacher', 'student', 'parent']), async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user); 
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
