import express, { NextFunction } from 'express';
import { MongoClient } from 'mongodb';
import usersRouter from './routes/users'
import cardsRouter from './routes/cards'
import mongoose from 'mongoose';
import { Request, Response } from 'express';
const { PORT = 3000 } = process.env;
export interface IRequest extends Request {
  user?: Record<string, string>;
}
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
app.use((req: IRequest, res: Response, next) => {
  req.user = {
    _id: '64457eb9d067f5f3005aded3' 
  };

  next();
});
app.use('/cards', cardsRouter)
app.use('/users', usersRouter);


app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
}) 