const teacherSchema = new mongoose.Schema({
    name: String,
    subject: String,
    email: String,
    phone: String,
  });
  
  const Teacher = mongoose.model('Teacher', teacherSchema);
  