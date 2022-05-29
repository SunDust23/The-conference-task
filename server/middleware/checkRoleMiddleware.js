const jwt = require('jsonwebtoken');

module.exports = function (...roles) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next();
        }
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: "Не авторизован" });
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            console.log(decoded.role);
           
            for(let i = 0;  i < roles.length; i++){
                console.log(roles[i]);
                if (decoded.role == roles[i]) {
                    req.user = decoded;
                    console.log(decoded.role);
                    next();
                    return;
                }
            }
            return res.status(403).json({ message: "Нет доступа" });
            
        } catch (e) {
            res.status(401).json({ message: "Не авторизован" })
        }
    }
}

