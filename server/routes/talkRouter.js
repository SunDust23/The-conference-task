const Router = require('express');
const router = new Router();

const talkController = require('../controllers/talkController');

router.post('/',  talkController.create);
router.post('/:id', talkController.addUser);
router.get('/', talkController.getAll);
router.get('/:id', talkController.getOne);
router.put('/', talkController.update);
router.delete('/:id', talkController.delOne);

module.exports = router;