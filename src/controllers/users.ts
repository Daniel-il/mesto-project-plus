import { Request, Response } from 'express';
import User from '../models/user'
import { IRequest } from 'app';


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

export const getUser = (req: Request, res: Response) => {
    const { _id } = req.params;
    return User.findById(_id)
      .then((user) => {
        if (!user) {
          res
            .status(404)
            .send({ message: "пользователь не найден" });
        } else {
          res.send({ data: user });
        }
      })
      .catch((err) => console.log(err));
}
export const updateUserData = (req: IRequest, res: Response) => {
    const { name, about} = req.body

    return User.findByIdAndUpdate(req.user?._id, { name, about })
    .then((user) => {
      if (!user) {
        res.status(404).send({message: "Пользователь не найден"})
      } else {
        res.send({data: user})
      }
    })
    .catch((err) => console.log(err));
};

export const updateUserAvatar = (req: IRequest, res: Response) => {
  const { avatar } = req.body

  return User.findByIdAndUpdate(req.user?._id, { avatar })
  .then((user) => {
    if (!user) {
      res.status(404).send({message: "Пользователь не найден"})
    } else {
      res.send({data: user})
    }
  })
  .catch((err) => console.log(err));
};