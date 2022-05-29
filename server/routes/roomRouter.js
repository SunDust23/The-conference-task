const Router = require('express');
const router = new Router();
const checkRole = require('../middleware/checkRoleMiddleware');

const roomController = require('../controllers/roomController');

router.post('/', checkRole("ADMIN"), roomController.create);
router.get('/', roomController.getAll);

module.exports = router;