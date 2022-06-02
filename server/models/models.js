const sequelize = require('../db');
const { DataTypes } = require('sequelize'); //Описание типов данных

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
    isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
    activationLink: { type: DataTypes.STRING },
})

const Token = sequelize.define('token', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    refreshToken: { type: DataTypes.STRING, allowNull: false },
})

const Talk = sequelize.define('talk', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, unique: true, allowNull: false },
    description: { type: DataTypes.STRING },
})

const Room = sequelize.define('room', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    num: { type: DataTypes.INTEGER, unique: true, allowNull: false },
    subject: { type: DataTypes.STRING }
})

const Schedule = sequelize.define('schedule', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    beginDatetime: { type: DataTypes.DATE, allowNull: false },
    endDatetime: { type: DataTypes.DATE, allowNull: false }
})

const Speaker = sequelize.define('speaker', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
})

Room.hasMany(Schedule, { onDelete: 'cascade' });
Schedule.belongsTo(Room);

Talk.hasMany(Schedule, { onDelete: 'cascade' });
Schedule.belongsTo(Talk);

User.belongsToMany(Talk, { through: Speaker, onDelete: 'cascade' });
Talk.belongsToMany(User, { through: Speaker, onDelete: 'cascade' });

User.hasOne(Token);
Token.belongsTo(User);

module.exports = {
    User,
    Talk,
    Speaker,
    Room,
    Schedule,
    Token
}