const Router = require('express');
const userController = require('../controllers/userController');
const router = new Router();

const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

//Auth
router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.check);

//CRUD for admins
router.get('/', checkRole("ADMIN"), userController.getAll);
router.put('/', checkRole("ADMIN"), userController.update);
router.delete('/:id', checkRole("ADMIN"), userController.delOne);

module.exports = router;