const db = require('../config/db');

//get all products
exports.getAllProducts = (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
};

//get product by id
exports.getProductById = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(result[0]);
    });
};

//create product
exports.createProduct = (req, res) => {
    console.log('Request body:', req.body); // Debugging line
    const { name, description, image_url, price, stock } = req.body;
    const sql = 'INSERT INTO products (name, description, image_url, price, stock) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, description, image_url, price, stock], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
    });
};

//update product
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, description, image_url, price, stock } = req.body;
    const sql = 'UPDATE products SET name = ?, description = ?, image_url = ?, price = ?, stock = ? WHERE id = ?';
    db.query(sql, [name, description, image_url, price, stock, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully' });
    });
};

//delete product
exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    });
};