const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors()); 
app.use(express.json());

// ෆොටෝ සේව් කරන්න 'uploads' කියලා ෆෝල්ඩරයක් නැත්නම් ඒක හදනවා
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// ෆොටෝ එකේ Path එක Frontend එකට පේන්න static විදිහට දෙනවා
app.use('/uploads', express.static('uploads'));

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', 
    database: 'monny_management',
    port: 3306  
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.message);
        return;
    }
    console.log('MySQL Database connected successfully!');
});

// Multer Config (ෆොටෝ සේව් කරන විදිහ)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // උදා: 173945.jpg
    }
});

const upload = multer({ storage: storage });

// --- ROUTES ---

// 1. සියලුම වියදම් ලබා ගැනීම
app.get('/api/expenses', (req, res) => {
    const sql = "SELECT * FROM expenses ORDER BY date DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. අලුත් වියදමක් සහ ෆොටෝ එකක් එකතු කිරීම
// 'image' කියන නම තමයි frontend එකේ formData එකේ තියෙන්න ඕනේ
app.post('/api/expenses', upload.single('image'), (req, res) => {
    const { user_id, date, description, amount } = req.body;
    const imagePath = req.file ? req.file.filename : null;

    const sql = "INSERT INTO expenses (user_id, date, description, amount, image_path) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [user_id, date, description, amount, imagePath], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Data insert error!", details: err.message });
        }
        res.json({ message: "Expense added successfully!", expenseId: result.insertId });
    });
});

// 3. වියදමක් මකා දැමීම
app.delete('/api/expenses/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM expenses WHERE expense_id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Expense deleted!" });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});