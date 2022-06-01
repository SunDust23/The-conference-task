const { User, Talk, Speaker } = require('../models/models');
const ApiError = require('../error/ApiError');

const error_message_code = require('../error/ErrorMessages');

class TalkController {
    async create(req, res, next) {
        try {
            const { title, description } = req.body;
            if (!title) {
                return next(ApiError.badRequest(error_message_code[474]));
            }
            const newTalk = await Talk.findOne({ where: { title } });
            if (newTalk) {
                return next(ApiError.badRequest(error_message_code[473]));
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
            console.log(userId);
            const newUser = await User.findOne({ where: { id: userId } });

            console.log(newUser);

            if (!newUser) {
                return next(ApiError.badRequest(error_message_code[452]));
            }
            const { id } = req.params;

            console.log(id);

            const talk = await Talk.findOne(
                {
                    where: { id }
                },
            )
            if (!talk) {
                return next(ApiError.badRequest(error_message_code[472]));
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
                return next(ApiError.badRequest(error_message_code[490]));
            }
            if (!title || !description) {
                return next(ApiError.badRequest(error_message_code[474]));
            }

            let talk = await Talk.findOne(
                {
                    where: { id }
                },
            );
            if (!talk) {
                return next(ApiError.badRequest(error_message_code[472]));
            }

            //Здесь, возможно, нужна проверка на то, является ли докладчик автором доклалда или это админ

            await Talk.update(
                {
                    title: title,
                    description: description
                },
                {
                    where: { id },
                }
            );

            talk = await Talk.findOne(
                {
                    where: { id }
                },
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
                return next(ApiError.badRequest(error_message_code[472]));
            }
            let talkId = id;

            //Здесь, возможно, нужна проверка на то, является ли докладчик автором доклалда или это админ

            await Talk.destroy({ where: { id } });

            return res.json(`Запись ${id} удалена`);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}
module.exports = new TalkController();