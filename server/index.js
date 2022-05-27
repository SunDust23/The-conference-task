require('dotenv').config();

const express = require('express');
const cors = require('cors');

const sequelize = require('./db');
const models = require('./models/models');
const router = require('./routes/routes');

const PORT = process.env.PORT || 7000;

const app = express();
app.use(cors());            // Нужен, чтобы принимать запросы с браузера
app.use(express.json());    // Необходимо, чтобы приложение могло парсить JSON формат  

app.use('/api', router);    // '/api' - URL, по которому должен обрабатывается router

//Все операции с БД - асинхронные
const start = async () => {
    try {
        await sequelize.authenticate();         //Установка подключения к БД
        await sequelize.sync({alter: true});    //Сверяем состояние БД со схемой данных

        /* В случае изменения модели {alter: true} вносит изменения в существующие таблицы 
        * {force: true} - пересоздаёт таблицы заново
        * sequelize.sync() - создаёт таблицы, если они не существуют
        */

        app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();