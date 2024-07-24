const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = 3000;

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log('Database connected!');
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(403).send({ message: "No token provided!" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).send({ message: "Failed to authenticate token." });
    req.userId = decoded.id;
    next();
  });
};

// Models and controllers combined

// User model
const createUser = (username, password, result) => {
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return result(err, null);

    db.query("INSERT INTO Users SET ?", { username, password: hashedPassword }, (err, res) => {
      if (err) return result(err, null);
      result(null, { id: res.insertId, username });
    });
  });
};

const findUserByUsername = (username, result) => {
  db.query("SELECT * FROM Users WHERE username = ?", [username], (err, res) => {
    if (err) return result(err, null);
    result(null, res[0]);
  });
};

// Expense model
const createExpense = (userId, amount, date, category, result) => {
  db.query("INSERT INTO Expenses SET ?", { user_id: userId, amount, date, category }, (err, res) => {
    if (err) return result(err, null);
    result(null, { id: res.insertId, userId, amount, date, category });
  });
};

const findExpensesByUserId = (userId, result) => {
  db.query("SELECT * FROM Expenses WHERE user_id = ?", [userId], (err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};

const updateExpenseById = (id, amount, date, category, result) => {
  db.query(
    "UPDATE Expenses SET amount = ?, date = ?, category = ? WHERE id = ?",
    [amount, date, category, id],
    (err, res) => {
      if (err) return result(err, null);
      result(null, res);
    }
  );
};

const deleteExpenseById = (id, result) => {
  db.query("DELETE FROM Expenses WHERE id = ?", [id], (err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};

// Routes
app.post('/api/register', (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send({ message: "Content cannot be empty!" });
  }

  findUserByUsername(req.body.username, (err, data) => {
    if (data) {
      return res.status(400).send({ message: "Username is already taken!" });
    }

    createUser(req.body.username, req.body.password, (err, data) => {
      if (err) return res.status(500).send({ message: err.message || "Some error occurred while creating the User." });
      res.send(data);
    });
  });
});

app.post('/api/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send({ message: "Content cannot be empty!" });
  }

  findUserByUsername(req.body.username, (err, user) => {
    if (err || !user) return res.status(404).send({ message: "User not found!" });

    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (err || !isMatch) return res.status(401).send({ message: "Invalid password!" });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.send({ auth: true, token });
    });
  });
});

app.post('/api/expenses', authenticateToken, (req, res) => {
  if (!req.body.amount || !req.body.date || !req.body.category) {
    return res.status(400).send({ message: "Content cannot be empty!" });
  }

  createExpense(req.userId, req.body.amount, req.body.date, req.body.category, (err, data) => {
    if (err) return res.status(500).send({ message: err.message || "Some error occurred while creating the Expense." });
    res.send(data);
  });
});

app.get('/api/expenses', authenticateToken, (req, res) => {
  findExpensesByUserId(req.userId, (err, data) => {
    if (err) return res.status(500).send({ message: err.message || "Some error occurred while retrieving expenses." });
    res.send(data);
  });
});

app.put('/api/expenses/:id', authenticateToken, (req, res) => {
  if (!req.body.amount || !req.body.date || !req.body.category) {
    return res.status(400).send({ message: "Content cannot be empty!" });
  }

  updateExpenseById(req.params.id, req.body.amount, req.body.date, req.body.category, (err, data) => {
    if (err) {
      if (err.kind === "not_found") return res.status(404).send({ message: `Not found Expense with id ${req.params.id}.` });
      return res.status(500).send({ message: "Error updating Expense with id " + req.params.id });
    }
    res.send(data);
  });
});

app.delete('/api/expenses/:id', authenticateToken, (req, res) => {
  deleteExpenseById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") return res.status(404).send({ message: `Not found Expense with id ${req.params.id}.` });
      return res.status(500).send({ message: "Could not delete Expense with id " + req.params.id });
    }
    res.send({ message: `Expense was deleted successfully!` });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
