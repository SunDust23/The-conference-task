const { Room } = require('../models/models');

class RoomController {
    async create(req, res) {
        const {num, subject} = req.body;
        const room = await Room.create({num, subject});
        return res.json(room);
    }
    async getAll(req, res) {
        const rooms = await Room.findAll();
        return res.json(rooms);
    }
}
module.exports = new RoomController();