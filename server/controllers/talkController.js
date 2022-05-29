const { Talk, Speaker } = require('../models/models');
const ApiError = require('../error/ApiError');

const status_code = require('../error/BadRequestErrorMessages');

class TalkController {
    async create(req, res, next) {
        try {
            const { title, description } = req.body;
            if (!title) {
                return next(ApiError.badRequest(status_code[474]));
            }
            const newTalk = await Talk.findOne({ where: { title } });
            if (newTalk) {
                return next(ApiError.badRequest(status_code[473]));
            }
            const userId = req.user.id;
            const talk = await Talk.create({ title, description });
            const talkId = talk.id;
            const speaker = await Speaker.create({ userId, talkId })
            return res.json(talk);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async addUser(req, res, next) {
        try {
            const { userId } = req.body;
            const newUser = await User.findOne({ where: { id: userId } });
            if (!newUser) {
                return next(ApiError.badRequest(status_code[452]));
            }
            const { id } = req.params;
            const talk = await Talk.findOne(
                {
                    where: { id }
                },
            )
            if (!talk) {
                return next(ApiError.badRequest(status_code[472]));
            }
            const talkId = talk.id;
            const speaker = await Speaker.create({ userId, talkId })
            return res.json(speaker);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getAll(req, res) {
        const talks = await Talk.findAll();
        return res.json(talks);
    }
    async getOne(req, res) {
        let { id } = req.params;
        let talk = await Talk.findOne(
            {
                where: { id }
            },
        )
        return res.json(talk);
    }
    async update(req, res, next) {
        try {
            const { id, title, description } = req.body;

            if (!id) {
                return next(ApiError.badRequest(status_code[490]));
            }
            if (!title || !description) {
                return next(ApiError.badRequest(status_code[474]));
            }

            const talk = await Talk.findOne(
                {
                    where: { id }
                },
            );
            if (!talk) {
                return next(ApiError.badRequest(status_code[472]));
            }

            await Talk.update(
                {
                    title: title,
                    description: description
                },
                {
                    where: { id },
                }
            );

            return res.json(talk);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async delOne(req, res, next) {
        try {
            let { id } = req.params;
            const delTalk = await Talk.findOne({ where: { id } });
            if (!delTalk) {
                return next(ApiError.badRequest(status_code[472]));
            }
            let talk = await Talk.destroy({ where: { id } });
            return res.json(`Запись ${id} удалена`);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}
module.exports = new TalkController();