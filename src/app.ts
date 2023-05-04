/* eslint-disable import/no-cycle */
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { responseDataNotFoundCode } from './utils/constants';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';

const { PORT = 3000 } = process.env;
export interface IRequest extends Request {
  user?: Record<string, string>;
}
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
app.use((req: Request, res: Response, next: NextFunction) => {
  res
    .status(responseDataNotFoundCode)
    .send({ message: 'Такого маршрута не существует' });
  next();
});
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
