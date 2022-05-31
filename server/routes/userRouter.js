const Router = require('express');
const userController = require('../controllers/userController');
const router = new Router();

const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');
const { body } = require('express-validator');

//Auth
router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 32 }),
    body('role').isIn([null, 'SPEAKER', 'ADMIN']),
    userController.registration
);

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/activate/:link', userController.activate);

router.get('/', authMiddleware, userController.getAll);

//CRUD for admins
router.put('/', checkRole("ADMIN"), userController.update);
router.delete('/:id', checkRole("ADMIN"), userController.delOne);

module.exports = router;