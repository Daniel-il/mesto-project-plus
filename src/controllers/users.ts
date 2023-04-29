import { Request, Response } from 'express';
import { IRequest } from '../app';
import {
  errorMessage404,
  responseDataNotFoundCode,
  responseInternalServerErrorCode,
  errorMessage500,
  errorMessagePlural404,
} from '../routes/constants';

import User from '../models/user';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => {
    if (!users) {
      return res.status(responseDataNotFoundCode).send({ message: errorMessagePlural404 });
    }
    return res.send({ data: users });
  })
  .catch(() => res.status(responseInternalServerErrorCode).send({ message: errorMessage500 }));

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(responseInternalServerErrorCode).send({ message: errorMessage500 }));
};

export const getUser = (req: Request, res: Response) => {
  const { _id } = req.params;
  return User.findById(_id)
    .then((user) => {
      if (!user) {
        res.status(responseDataNotFoundCode).send({ message: errorMessage404 });
      } else {
        res.send({ data: user });
      }
    })
    .catch(() => res.status(responseInternalServerErrorCode).send({ message: errorMessage500 }));
};
export const updateUserData = (req: IRequest, res: Response) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user?._id, { name, about })
    .then((user) => {
      if (!user) {
        res.status(responseDataNotFoundCode).send({ message: errorMessage404 });
      } else {
        res.send({ data: user });
      }
    })
    .catch(() => res.status(responseInternalServerErrorCode).send({ message: errorMessage500 }));
};

export const updateUserAvatar = (req: IRequest, res: Response) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user?._id, { avatar })
    .then((user) => {
      if (!user) {
        res.status(responseDataNotFoundCode).send({ message: errorMessage404 });
      } else {
        res.send({ data: user });
      }
    })
    .catch(() => res.status(responseInternalServerErrorCode).send({ message: errorMessage500 }));
};
