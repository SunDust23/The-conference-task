const { Room } = require('../models/models');
const ApiError = require('../error/ApiError');

const error_message_code = require('../error/ErrorMessages');


class RoomController {
    async create(req, res, next) {
        const { num, subject } = req.body;
        if (!num) {
            return next(ApiError.badRequest(error_message_code[478]));
        }
        const newRoom = await Room.findOne({ where: { num } });
        if (newRoom) {
            return next(ApiError.badRequest(error_message_code[484]));
        }
        const room = await Room.create({ num, subject });
        return res.json(room);
    }
    async getAll(req, res) {
        const rooms = await Room.findAll();
        return res.json(rooms);
    }
}
module.exports = new RoomController();