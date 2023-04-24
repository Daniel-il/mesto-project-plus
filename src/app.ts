import express, { NextFunction } from 'express';
import  { MongoClient } from 'mongodb';
import usersRouter from './routes/users'
import mongoose from 'mongoose';
/* Создаём экземпляр MongoClient, передав URL для подключения к MongoDB */
const { PORT = 3000 } = process.env;
export interface IRequest extends Request {
    user?: Record<string, string>;
  }
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
/* Подключаемся. Обратите внимание на то, что метод асинхронный */
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')


app.use('/users', usersRouter)

app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
}) 