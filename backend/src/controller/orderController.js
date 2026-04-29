const db = require('../config/db');

//create order
exports.createOrder = (req, res) => {
    console.log('createOrder payload:', req.body);
    const { user_id, products } = req.body || {};

    if (!user_id || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: 'Invalid order payload' });
    }
    //insert table orders user_id, status, total_mount
    const totalAmount = products.reduce((total, item) => total + (item.price * item.quantity), 0);
    const orderSql = 'INSERT INTO orders (user_id, status, total_amount) VALUES (?, ?, ?)';
    db.query(orderSql, [user_id, 'pending', totalAmount], (err, orderResult) => {
        if (err) {
            console.error('Error creating order:', err);
            return res.status(500).json({ error: 'Failed to create order' });
        }

        const orderId = orderResult.insertId;

        const orderItemsSql = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?';
        const orderItemsValues = products.map(item => [orderId, item.product_id, item.quantity, item.price]);
        db.query(orderItemsSql, [orderItemsValues], (err) => {
            if (err) {
                console.error('Error creating order items:', err);
                return res.status(500).json({ error: 'Failed to create order items' });
            }

            return res.status(201).json({
                message: 'Order created successfully',
                data: {
                    user_id,
                    productsCount: products.length,
                },
            });
        });
    });
};