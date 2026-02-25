const db = require('../config/db');

exports.getAllExpenses = (req, res) => {
    const sql = "SELECT * FROM expenses ORDER BY date DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.createExpense = (req, res) => {
    const { user_id, date, description, amount } = req.body;
    const imagePath = req.file ? req.file.filename : null;

    const sql = "INSERT INTO expenses (user_id, date, description, amount, image_path) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [user_id, date, description, amount, imagePath], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Data insert error!", details: err.message });
        }
        res.json({ message: "Expense added successfully!", expenseId: result.insertId });
    });
};

exports.deleteExpense = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM expenses WHERE expense_id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Expense deleted!" });
    });
};