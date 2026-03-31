const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const {checkAuth} = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', checkAuth, authController.getMe);

module.exports = router;