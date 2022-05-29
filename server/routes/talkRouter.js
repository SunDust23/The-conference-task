const Router = require('express');
const router = new Router();
const checkRole = require('../middleware/checkRoleMiddleware');

const talkController = require('../controllers/talkController');

router.post('/', checkRole("SPEAKER", "ADMIN"), talkController.create);
router.post('/:id', checkRole("SPEAKER", "ADMIN"), talkController.addUser);
router.get('/', talkController.getAll);
router.get('/:id', talkController.getOne);
router.put('/', checkRole("SPEAKER", "ADMIN"), talkController.update);
router.delete('/:id', checkRole("SPEAKER", "ADMIN"), talkController.delOne);

module.exports = router;