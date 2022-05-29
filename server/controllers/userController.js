const { User } = require('../models/models');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ApiError = require('../error/ApiError');
const status_code = require('../error/ErrorMessages');


const generateJwt = (id, username, role) => {
    return jwt.sign(
        { id, username, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
}
class UserController {
    async registration(req, res, next) {
        const { username, password, role } = req.body;
        if (!username || !password) {
            return next(ApiError.badRequest(status_code[463]));
        }
        const candidate = await User.findOne({ where: { username } });
        if (candidate) {
            return next(ApiError.badRequest(status_code[453]));
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({ username, role, password: hashPassword });

        const token = generateJwt(user.id, user.username, user.role);
        return res.json({ token })
    }
    async login(req, res, next) {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return next(ApiError.badRequest(status_code[452]));
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.badRequest(status_code[462]));
        }
        const token = generateJwt(user.id, user.username, user.role);
        return res.json({ token });
    }
    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.username, req.user.role);
        return res.json({ token });
    }

    async getAll(req, res) {
        const users = await User.findAll();
        return res.json(users);
    }
    async update(req, res, next) {
        try {
            const { id, username, password, role } = req.body;
            if (!id) {
                return next(ApiError.badRequest(status_code[490]));
            }
            if (!username || !password) {
                return next(ApiError.badRequest(status_code[462]));
            }
            const newUser = await User.findOne({ where: { id } });
            if (!newUser) {
                return next(ApiError.badRequest(status_code[452]));
            }
            const hashPassword = await bcrypt.hash(password, 5);

            let user = await User.update(
                {
                    username: username,
                    password: hashPassword,
                    role: role
                },
                {
                    where: { id },
                }
            );

            user = await User.findOne(
                {
                    where: { id }
                },
            )

            return res.json(user);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async delOne(req, res, next) {
        try {
            let { id } = req.params;
            const delUser = await User.findOne({ where: { id } });
            if (!delUser) {
                return next(ApiError.badRequest(status_code[452]));
            }
            let user = await User.destroy({ where: { id } });
            return res.json(`Запись ${id} удалена`);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}
module.exports = new UserController();