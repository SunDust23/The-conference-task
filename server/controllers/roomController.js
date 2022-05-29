const { Room } = require('../models/models');

class RoomController {
    async create(req, res, next) {
        const {num, subject} = req.body;
        if (!num) {
           // return next(ApiError.badRequest('Не указан номер аудитории'));
            return next(ApiError.badRequest(status_code[478]));
        }
        const newRoom = await Room.findOne({ where: { num } });
        if (newRoom) {
            return next(ApiError.badRequest(status_code[484]));
        }
        const room = await Room.create({num, subject});
        return res.json(room);
    }
    async getAll(req, res) {
        const rooms = await Room.findAll();
        return res.json(rooms);
    }
}
module.exports = new RoomController();