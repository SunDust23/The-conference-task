const sequelize = require('../db');
const { DataTypes } = require('sequelize'); //Описание типов данных

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "USER" }
})

const Talk = sequelize.define('talk', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, unique: true, allowNull: false },
    description: { type: DataTypes.STRING }
})

const Room = sequelize.define('room', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    num: { type: DataTypes.INTEGER, unique: true, allowNull: false },
    subject: { type: DataTypes.STRING }
})

const Schedule = sequelize.define('schedule', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    datetime: { type: DataTypes.DATE, allowNull: false }
})

const Speaker = sequelize.define('speaker', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
})

Room.hasMany(Schedule, {onDelete: 'cascade'});
Schedule.belongsTo(Room);

Talk.hasMany(Schedule, {onDelete: 'cascade'});
Schedule.belongsTo(Talk);

User.belongsToMany(Talk, {through: Speaker, onDelete: 'cascade'});
Talk.belongsToMany(User, {through: Speaker, onDelete: 'cascade'});

module.exports={
    User,
    Talk,
    Speaker,
    Room,
    Schedule
}