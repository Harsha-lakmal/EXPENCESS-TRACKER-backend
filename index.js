const express = require('express');
const cors = require('cors');
const fs = require('fs');
const expenseRoutes = require('./routes/expenses-route');

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Routes
app.use('/api/expenses', expenseRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});