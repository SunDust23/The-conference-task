/* Здесь указываются маршруты и роутеры, которые будут отрабатывать по этим маршрутам*/

const Router = require('express');
const router = new Router();

const roomRouter = require('./roomRouter');
const userRouter = require('./userRouter');
const talkRouter = require('./talkRouter');
const scheduleRouter = require('./scheduleRouter');


router.use('/user', userRouter);
router.use('/talk', talkRouter);
router.use('/room', roomRouter);
router.use('/schedule', scheduleRouter);

module.exports = router;