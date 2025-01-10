import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
const app = express();
const port = 3000;

dotenv.config(
  {
    path:'./.env'
  }
);

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: 'dbms-mysql-dbms-event.c.aivencloud.com',
  user: 'avnadmin',
  password: process.env.DB_PASSWORD,
  database: 'hospital_db',
  port:25370, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Routes
app.get('/api/patients', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Patients');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/patients', async (req, res) => {
  try {
    const { name, contact_number } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Patients (name, contact_number) VALUES (?, ?)',
      [name, contact_number]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/patients/:id', async (req, res) => {
  try {
    const { name, contact_number } = req.body;
    await pool.query(
      'UPDATE Patients SET name = ?, contact_number = ? WHERE patient_id = ?',
      [name, contact_number, req.params.id]
    );
    res.json({ message: 'Patient updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/patients/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM Patients WHERE patient_id = ?', [req.params.id]);
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/doctors', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, dept.dept_name 
      FROM Doctors d 
      LEFT JOIN Departments dept ON d.dept_id = dept.dept_id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/doctors', async (req, res) => {
  try {
    const { name, dept_id } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Doctors (name, dept_id) VALUES (?, ?)',
      [name, dept_id]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/doctors/:id', async (req, res) => {
  try {
    const { name, dept_id } = req.body;
    await pool.query(
      'UPDATE Doctors SET name = ?, dept_id = ? WHERE doctor_id = ?',
      [name, dept_id, req.params.id]
    );
    res.json({ message: 'Doctor updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/doctors/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM Doctors WHERE doctor_id = ?', [req.params.id]);
    res.json({ message: 'Doctor deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/departments', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Departments');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/departments', async (req, res) => {
  try {
    const { dept_name } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Departments (dept_name) VALUES (?)',
      [dept_name]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/departments/:id', async (req, res) => {
  try {
    const { dept_name } = req.body;
    await pool.query(
      'UPDATE Departments SET dept_name = ? WHERE dept_id = ?',
      [dept_name, req.params.id]
    );
    res.json({ message: 'Department updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/departments/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM Departments WHERE dept_id = ?', [req.params.id]);
    res.json({ message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/rooms', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, rt.type_name, rt.daily_rate, d.dept_name
      FROM Rooms r
      JOIN RoomTypes rt ON r.type_id = rt.type_id
      JOIN Departments d ON r.dept_id = d.dept_id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/room-types', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM RoomTypes');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/rooms', async (req, res) => {
  try {
    const { room_number, type_id, dept_id } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Rooms (room_number, type_id, dept_id, status) VALUES (?, ?, ?, "available")',
      [room_number, type_id, dept_id]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/rooms/:id', async (req, res) => {
  try {
    const { room_number, type_id, dept_id } = req.body;
    await pool.query(
      'UPDATE Rooms SET room_number = ?, type_id = ?, dept_id = ? WHERE room_id = ?',
      [room_number, type_id, dept_id, req.params.id]
    );
    res.json({ message: 'Room updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/rooms/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM Rooms WHERE room_id = ?', [req.params.id]);
    res.json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admissions', async (req, res) => {
  try {
    const { patient_id, room_id, primary_doctor_id } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Admissions (patient_id, room_id, primary_doctor_id) VALUES (?, ?, ?)',
      [patient_id, room_id, primary_doctor_id]
    );
    await pool.query(
      'UPDATE Rooms SET status = ? WHERE room_id = ?',
      ['occupied', room_id]
    );
    await pool.query(
      'UPDATE Patients SET status = ? WHERE patient_id = ?',
      ['admitted', patient_id]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/treatments', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, p.name as patient_name, d.name as doctor_name
      FROM Treatments t
      JOIN Patients p ON t.patient_id = p.patient_id
      JOIN Doctors d ON t.doctor_id = d.doctor_id
      ORDER BY t.treatment_date DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/treatments', async (req, res) => {
  try {
    const { patient_id, doctor_id } = req.body;
    const [result] = await pool.query(
      'INSERT INTO Treatments (patient_id, doctor_id) VALUES (?, ?)',
      [patient_id, doctor_id]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/treatments/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM Treatments WHERE treatment_id = ?', [req.params.id]);
    res.json({ message: 'Treatment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admissions', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*, p.name as patient_name, d.name as doctor_name, r.room_number
      FROM Admissions a
      JOIN Patients p ON a.patient_id = p.patient_id
      LEFT JOIN Doctors d ON a.primary_doctor_id = d.doctor_id
      JOIN Rooms r ON a.room_id = r.room_id
      ORDER BY a.admission_date DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admissions/:id/discharge', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [admission] = await conn.query(
      'SELECT * FROM Admissions WHERE admission_id = ?',
      [req.params.id]
    );

    if (!admission[0]) {
      throw new Error('Admission not found');
    }

    await conn.query(
      'UPDATE Admissions SET status = ?, discharge_date = NOW() WHERE admission_id = ?',
      ['discharged', req.params.id]
    );

    await conn.query(
      'UPDATE Rooms SET status = ? WHERE room_id = ?',
      ['available', admission[0].room_id]
    );

    await conn.query(
      'UPDATE Patients SET status = ? WHERE patient_id = ?',
      ['discharged', admission[0].patient_id]
    );

    await conn.commit();
    res.json({ message: 'Patient discharged successfully' });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    conn.release();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});