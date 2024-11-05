const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://22cs029:ktuapp@ktuapp.n4zhi.mongodb.net/KTU?retryWrites=true&w=majority&appName=KTUApp')
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Connection error:", error));

// Define Student schema
const studentSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  semester: String,
});

const Student = mongoose.model('Student', studentSchema);

// Define Course schema
const courseSchema = new mongoose.Schema({
  name: String,
  semester: String,
});

const Course = mongoose.model('Course', courseSchema);

// Define Result schema
const resultSchema = new mongoose.Schema({
  studentId: String,
  semester: String,
  marks: [
    {
      courseName: String,
      mark: Number,
    }
  ]
});

const Result = mongoose.model('Result', resultSchema);

// Endpoint to add a student
app.post('/api/students', async (req, res) => {
  const { studentId, name, semester } = req.body;
  const newStudent = new Student({ studentId, name, semester });
  await newStudent.save();
  res.status(201).send(newStudent);
});

// Endpoint to retrieve all students
app.get('/api/students', async (req, res) => {
  const students = await Student.find();
  res.status(200).send(students);
});

// Endpoint to fetch students by semester
app.get('/api/students/:semester', async (req, res) => {
  const { semester } = req.params;

  try {
    const students = await Student.find({ semester });
    res.status(200).send(students);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch students' });
  }
});

// Endpoint to add a course
app.post('/api/courses', async (req, res) => {
  const { name, semester } = req.body;
  if (!name || !semester) {
    return res.status(400).send({ error: 'Course name and semester are required' });
  }

  try {
    const newCourse = new Course({ name, semester });
    await newCourse.save();
    res.status(201).send(newCourse);
  } catch (error) {
    res.status(500).send({ error: 'Failed to add course' });
  }
});

// Endpoint to retrieve all courses for a specific semester
app.get('/api/courses', async (req, res) => {
  const { semester } = req.query;

  try {
    const courses = await Course.find({ semester });
    res.status(200).send(courses);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch courses' });
  }
});

// Endpoint to fetch courses by semester
app.get('/api/courses/:semester', async (req, res) => {
  const { semester } = req.params;

  try {
    const courses = await Course.find({ semester });
    res.status(200).send(courses);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch courses' });
  }
});

// Endpoint to delete a course by ID
app.delete('/api/courses/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Course.findByIdAndDelete(id);
    res.status(200).send({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete course' });
  }
});

// Endpoint to add or update results for a student
app.post('/api/results', async (req, res) => {
  const { studentId, semester, marks } = req.body;

  if (!marks || marks.some((mark) => mark.mark === undefined)) {
    return res.status(400).send({ error: 'All course marks must be entered' });
  }

  try {
    // Upsert result (insert if doesn't exist, update if exists)
    const result = await Result.findOneAndUpdate(
      { studentId, semester },
      { studentId, semester, marks },
      { upsert: true, new: true }
    );
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ error: 'Failed to update results' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
