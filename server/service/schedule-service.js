const { Schedule } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require("sequelize");
const error_message_code = require('../error/ErrorMessages');

class ScheduleService {
    async checkDate(roomId, begin, end) {
        const schedule = await Schedule.findOne(
            {
                where:
                {
                    roomId,
                    [Op.or]: [
                        { [Op.and]: [{ beginDatetime: { [Op.lt]: end }, endDatetime: { [Op.gte]: end } }] },
                        { [Op.and]: [{ beginDatetime: { [Op.lte]: begin }, endDatetime: { [Op.gte]: end } }] },
                        { [Op.and]: [{ beginDatetime: { [Op.lte]: begin }, endDatetime: { [Op.gt]: begin } }] },
                        { [Op.and]: [{ beginDatetime: { [Op.gte]: begin }, endDatetime: { [Op.lte]: end } }]}
                    ]
                }
            });
        if (schedule) {
            throw ApiError.badRequest(error_message_code[483]);
        }
        return null;
    }

    async checkUpdateDate(updatedId, roomId, begin, end) {
        const schedule = await Schedule.findOne(
            {
                where:
                {
                    roomId,
                    [Op.or]: [
                        { [Op.and]: [{ beginDatetime: { [Op.lt]: end }, endDatetime: { [Op.gte]: end } }] },
                        { [Op.and]: [{ beginDatetime: { [Op.lte]: begin }, endDatetime: { [Op.gte]: end } }] },
                        { [Op.and]: [{ beginDatetime: { [Op.lte]: begin }, endDatetime: { [Op.gt]: begin } }] }
                    ]
                }
            });
        if (schedule && schedule.id != updatedId) {
            throw ApiError.badRequest(error_message_code[483]);
           
        }
        return schedule;
    }
}

module.exports = new ScheduleService();