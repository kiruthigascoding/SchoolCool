const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student'); 
const staffRoutes = require('./routes/staff');
const teacherRoutes = require('./routes/teacher');
//const attendanceRoutes = require('./routes/attendance');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes); 
app.use('/api/staff', staffRoutes);
app.use('/api/teacher', teacherRoutes);
//app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 5000;



mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    createAdminAccount();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

  const createAdminAccount = async () => {
    try {
      const adminExists = await User.findOne({ role: 'admin' });
  
      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt); // Pre-defined admin password
  
        const newAdmin = new User({
          username: 'admin',  // Admin username
          email: 'admin@school.com',  // Admin email
          password: hashedPassword,
          role: 'admin',  // Admin role
        });
  
        await newAdmin.save();
        console.log('Admin account created successfully');
      } else {
        console.log('Admin account already exists');
      }
    } catch (error) {
      console.error('Error creating admin account:', error);
    }
  };
  