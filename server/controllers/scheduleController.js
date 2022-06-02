const { Schedule } = require('../models/models');
const ApiError = require('../error/ApiError');

const error_message_code = require('../error/ErrorMessages');
const scheduleService  = require('../service/schedule-service');
const { Op } = require('sequelize');

class ScheduleController {
    async create(req, res, next) {
        try {
            let { roomId, talkId, begin, end } = req.body;

            if (!roomId) {
                return next(ApiError.badRequest(error_message_code[478]));
            }
            if (!talkId) {
                return next(ApiError.badRequest(error_message_code[477]));
            }
            if (!begin || !end) {
                return next(ApiError.badRequest(error_message_code[479]));
            }
            if (begin >= end) {
                return next(ApiError.badRequest(error_message_code[485]));
            }

            await scheduleService.checkDate(roomId, begin, end);
           
            const schedule = await Schedule.create({ roomId, talkId, beginDatetime: begin, endDatetime: end });
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
            const { id, roomId, talkId, begin, end } = req.body;

            if (!id) {
                return next(ApiError.badRequest(error_message_code[490]));
            }
            if (!roomId) {
                return next(ApiError.badRequest(error_message_code[478]));
            }
            if (!talkId) {
                return next(ApiError.badRequest(error_message_code[477]));
            }
            if (!begin || !end) {
                return next(ApiError.badRequest(error_message_code[479]));
            }
            if (begin >= end) {
                return next(ApiError.badRequest(error_message_code[485]));
            }

           await scheduleService.checkUpdateDate(id, roomId, begin, end);

            let updatedSchedule = await Schedule.update(
                {
                    roomId: roomId,
                    talkId: talkId,
                    beginDatetime: begin, 
                    endDatetime: end
                },
                {
                    where: { id },
                }
            );

            updatedSchedule = await Schedule.findOne(
                {
                    where: { id }
                },
            )

            return res.json(updatedSchedule);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async delOne(req, res, next) {
        try {
            let { id } = req.params;
            const delSchedule = await Schedule.findOne({ where: { id } });
            if (!delSchedule) {
                return next(ApiError.badRequest(error_message_code[482]));
            }
            let schedule = await Schedule.destroy({ where: { id } });
            return res.json(`Запись ${id} удалена`);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}
module.exports = new ScheduleController();