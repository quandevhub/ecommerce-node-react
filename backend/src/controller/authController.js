const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//register user
exports.register = (req, res) => {
    const { email, password_hash } = req.body;

    if (!email || !password_hash) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = bcrypt.hash(password_hash, 10);
        const insertSql = 'INSERT INTO users (email, password_hash) VALUES (?, ?)';
        db.query(insertSql, [email, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error' });

            const token = jwt.sign(
                { id: result.insertId, email: result.email, role: result.role }, 
                process.env.JWT_SECRET, 
                { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
            );

            res.status(201).json({ message: 'User registered successfully', token });
        });
    });
};

//login user
exports.login = (req, res) => {
    const { email, password_hash } = req.body;

    if (!email || !password_hash) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        const isPasswordValid = bcrypt.compare(password_hash, user.password_hash);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        res.status(200).json({ message: 'Login successful', token });
    });
};

//get me
exports.getMe = (req, res) => {
    const userId = req.user.id;

    const sql = 'SELECT id, email, role FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];
        res.status(200).json({ user });
    });
}