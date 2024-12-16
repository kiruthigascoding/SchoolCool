const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
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
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
