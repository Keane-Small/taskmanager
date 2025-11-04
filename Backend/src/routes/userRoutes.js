const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const auth = require('../middleware/auth');

// Public
router.post('/register', controller.createUser);
router.post('/login', controller.login);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password/:token', controller.resetPassword);
router.get('/verify-reset-token/:token', controller.verifyResetToken);

// Protected
router.get('/', auth, controller.getUsers);
router.get('/:id', auth, controller.getUserById);
router.put('/:id', auth, controller.updateUser);
router.delete('/:id', auth, controller.deleteUser);

// Profile routes
router.get('/profile/me', auth, controller.getProfile);
router.put('/profile/update', auth, controller.updateProfile);
router.put('/profile', auth, controller.updateUserProfile);
router.put('/profile/image', auth, controller.updateProfileImage);
router.put('/password', auth, controller.changePassword);

module.exports = router;
