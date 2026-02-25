const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const expenseController = require('../controllers/expenseController');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

// Define Routes
router.get('/', expenseController.getAllExpenses);
router.post('/', upload.single('image'), expenseController.createExpense);
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;