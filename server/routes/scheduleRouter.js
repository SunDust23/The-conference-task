const Router = require('express');
const router = new Router();

const scheduleController = require('../controllers/scheduleController');

router.post('/', scheduleController.create);
router.get('/', scheduleController.getAll);
router.get('/:id', scheduleController.getOne);
router.put('/', scheduleController.update);
router.delete('/:id', scheduleController.delOne);

module.exports = router;