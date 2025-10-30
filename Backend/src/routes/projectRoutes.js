const express = require('express');
const router = express.Router();
const controller = require('../controllers/projectController');
const auth = require('../middleware/auth');

// All routes require authentication
router.post('/', auth, controller.createProject);
router.get('/', auth, controller.getProjects);
router.get('/:id', auth, controller.getProjectById);
router.put('/:id', auth, controller.updateProject);
router.delete('/:id', auth, controller.deleteProject);

// Collaborator routes
router.post('/:projectId/collaborators', auth, controller.addCollaborator);
router.delete('/:projectId/collaborators/:userId', auth, controller.removeCollaborator);
router.get('/:projectId/collaborators', auth, controller.getCollaborators);

module.exports = router;
