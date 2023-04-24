import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import User from '../models/user'
import { Types } from 'mongoose';

export const getUsers = (req: Request, res: Response) => {
    return User.find({})
        .then(users => res.send({ data: users }))
        .catch(() => res.status(500).send({ message: 'Произошла ошибка' }))
}

export const createUser = (req: Request, res: Response) => {
    const { name, about, avatar } = req.body;

    return User.create({ name, about, avatar })
        .then(user => res.send({ data: user }))
        .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export const getUser = async (req: Request, res: Response) => {
    const { _id } = req.params;
    return User.find({ _id: new ObjectId(_id) })
      .then((user) => {
        if (!user.length) {
          res
            .status(404)
            .send({ message: "пользователь не найден" });
        } else {
          res.send({ data: user });
        }
      })
      .catch((err) => console.log(err));
}