const { User } = require('../models/models');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ApiError = require('../error/ApiError');
const status_code = require('../error/codes');


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
}
module.exports = new UserController();