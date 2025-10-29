const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const auth = require('../middleware/auth');

// Public
router.post('/register', controller.createUser);
router.post('/login', controller.login);

// Protected
router.get('/', auth, controller.getUsers);
router.get('/:id', auth, controller.getUserById);
router.put('/:id', auth, controller.updateUser);
router.delete('/:id', auth, controller.deleteUser);

module.exports = router;
