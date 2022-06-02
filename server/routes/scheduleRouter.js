const Router = require('express');
const router = new Router();
const checkRole = require('../middleware/checkRoleMiddleware');

const scheduleController = require('../controllers/scheduleController');

router.post('/', checkRole("ADMIN"), scheduleController.create);

router.get('/', scheduleController.getAll);
router.get('/:id', scheduleController.getOne);
router.put('/', checkRole("ADMIN"), scheduleController.update);
router.delete('/:id', checkRole("ADMIN"), scheduleController.delOne);

module.exports = router;