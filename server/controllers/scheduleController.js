const { Schedule } = require('../models/models');
const ApiError = require('../error/ApiError');

const status_code = require('../error/ErrorMessages');

class ScheduleController {
    async create(req, res, next) {
        try {
            let { roomId, talkId, datetime } = req.body;

            if (!roomId) {
                return next(ApiError.badRequest(status_code[478]));
            }
            if (!talkId) {
                return next(ApiError.badRequest(status_code[477]));
            }
            if (!datetime) {
                return next(ApiError.badRequest(status_code[479]));
            }

            const newSchedule = await Schedule.findOne({ where: { roomId, datetime } }); //сделать + проверку на 15 минут вперёд
            if (newSchedule) {
                return next(ApiError.badRequest(status_code[483]));
            }

            const schedule = await Schedule.create({ roomId, talkId, datetime });
            return res.json(schedule)
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getAll(req, res) {
        let { roomId, talkId, limit, page } = req.query;
        page = page || 1;
        limit = limit || 9;
        let offset = page * limit - limit;
        let schedules;
        if (roomId && talkId) {
            schedules = await Schedule.findAndCountAll({ where: { talkId, roomId }, limit, offset });
        }
        if (!roomId && talkId) {
            schedules = await Schedule.findAndCountAll({ where: { talkId }, limit, offset });
        }
        if (roomId && !talkId) {
            schedules = await Schedule.findAndCountAll({ where: { roomId }, limit, offset });
        }
        if (!roomId && !talkId) {
            schedules = await Schedule.findAndCountAll({ limit, offset });
        }
        return res.json(schedules);
    }
    async getOne(req, res) {
        let { id } = req.params;
        let schedule = await Schedule.findOne(
            {
                where: { id }
            },
        )
        return res.json(schedule);
    }
    async update(req, res, next) {
        try {
            const { id, roomId, talkId, datetime } = req.body;


            if (!id) {
                return next(ApiError.badRequest(status_code[490]));
            }
            if (!roomId) {
                return next(ApiError.badRequest(status_code[478]));
            }
            if (!talkId) {
                return next(ApiError.badRequest(status_code[477]));
            }
            if (!datetime) {
                return next(ApiError.badRequest(status_code[479]));
            }

            let schedule = await Schedule.update(
                {
                    roomId: roomId,
                    talkId: talkId,
                    datetime: datetime
                },
                {
                    where: { id },
                }
            );

            schedule = await Schedule.findOne(
                {
                    where: { id }
                },
            )

            return res.json(schedule);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async delOne(req, res, next) {
        try {
            let { id } = req.params;
            const delSchedule = await Schedule.findOne({ where: { id } });
            if (!delSchedule) {
                return next(ApiError.badRequest(status_code[482]));
            }
            let schedule = await Schedule.destroy({ where: { id } });
            return res.json(`Запись ${id} удалена`);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}
module.exports = new ScheduleController();