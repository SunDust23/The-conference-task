const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');
const tokenService = require('../service/token-service');

module.exports = function (...roles) {
    return function (req, res, next) {
        try {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                return next(ApiError.UnauthorizedError());
            }
            const accessToken = authorizationHeader.split(' ')[1];
            if (!accessToken) {
                return next(ApiError.UnauthorizedError());
            }
            const userData = tokenService.validateAccessToken(accessToken);
            if (!userData) {
                return next(ApiError.UnauthorizedError());
            }

            for (let i = 0; i < roles.length; i++) {
                if (userData.role == roles[i]) {
                    req.user = userData;
                    next();
                    return;
                }
            }
            return next(ApiError.forbidden('Нет доступа'));

        } catch (e) {
            return next(ApiError.UnauthorizedError());
        }
    }
}

