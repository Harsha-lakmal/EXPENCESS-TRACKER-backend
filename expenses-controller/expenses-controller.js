const db = require('../db/db-connection');

const getAllExpenses = (req, res) => {
    const sql = "SELECT * FROM expenses ORDER BY date DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

const createExpense = (req, res) => {
    const { user_id, date, description, amount } = req.body;
    const imagePath = req.file ? req.file.filename : null;

    const sql = "INSERT INTO expenses (date,description,amount,image_path) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [date, description, amount, imagePath], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Data insert error!", details: err.message });
        }
        res.json({ message: "Expense added successfully!", expenseId: result.insertId });
    });
};

const deleteExpense = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM expenses WHERE expense_id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Expense deleted!" });
    });
};

const UpdateExpense = (req, res) => {
    const { id } = req.params;
    
    const { date, description, amount } = req.body;
    
    
    const imagePath = req.file ? req.file.filename : req.body.image_path;

     
    const sql = "UPDATE expenses SET date=?, description=?, amount=?, image_path=? WHERE expense_id=?";

    db.query(sql, [date, description, amount, imagePath, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Expense not found" });
        }

        res.json({ message: "Expense updated successfully!" });
    });
};

module.exports = {
    getAllExpenses,
    createExpense,
    deleteExpense,
    UpdateExpense
} 