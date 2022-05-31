require('dotenv').config();

const { User } = require('../models/models');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ApiError = require('../error/ApiError');
const status_code = require('../error/ErrorMessages');
const userService = require('../service/user-service');

const { validationResult } = require('express-validator');


// const generateJwt = (id, username, role) => {
//     return jwt.sign(
//         { id, username, role },
//         process.env.SECRET_KEY,
//         { expiresIn: '24h' }
//     );
// }

class UserController {

    ////////////
    /// AUTH ///
    ////////////

    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest(`Ошибка при валидации`, errors.array()));
            }

            const { email, password, role } = req.body;
            const userData = await userService.registration(email, password, role);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData);

        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData);

        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.username, req.user.role);
        return res.json({ token });
    }
    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }

    }
    async refresh(req, res, next) {

    }
    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            console.log(activationLink);
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }


    ////////////
    /// CRUD ///
    ////////////

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