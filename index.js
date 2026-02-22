const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json());
app.use(express.json());  

 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', 
    database: 'monny_management',
    port: 3306  
});

 
db.connect((err) => {
    if (err) {
        console.error('Database  connect is fail: ' + err.message);
        return;
    }
    console.log('MySQL Database connect succsess ...!');
});


 
app.get('/users', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Data fetch කිරීමේ දෝෂයක්!" });
        }
        res.json(results);  
    });
});
 
app.post('/add-user', (req, res) => {
    const { name, age, address, mail } = req.body;
    const sql = "INSERT INTO users (name, age, address, mail) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [name, age, address, mail], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Data insert kireeme doshayak!", details: err.message });
        }
        res.json({ message: "User saarthakawa add kala!", userId: result.insertId });
    });
});

 
const PORT = 3000;  
app.listen(PORT, () => {
    console.log(`Server eka port ${PORT} eke weda karai.`);
});