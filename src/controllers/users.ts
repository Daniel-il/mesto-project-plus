import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IRequest } from '../app';
import {
  errorMessage404,
  responseDataNotFoundCode,
  responseInternalServerErrorCode,
  errorMessage500,
  errorMessage400,
  responseIncorrectDataCode,
  responseDataCreated,
  secretKey,
  responseUnauthorizedDataCode,
  errorMessage401,
} from '../utils/constants';

import User from '../models/user';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(responseInternalServerErrorCode).send({ message: errorMessage500 }));

export const createUser = (req: Request, res: Response) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(responseDataCreated).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(responseIncorrectDataCode).send({ message: errorMessage400 });
      }

      return res.status(responseInternalServerErrorCode).send({ message: errorMessage500 });
    });
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
    .catch(() => (err: Error) => {
      if (err.name === 'CastError') {
        res.status(responseIncorrectDataCode).send({ message: errorMessage400 });
      } else res.status(responseInternalServerErrorCode).send({ message: errorMessage500 });
    });
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
    .catch(() => (err: Error) => {
      if (err.name === 'ValidationError') {
        res.status(responseIncorrectDataCode).send({ message: errorMessage400 });
      } else res.status(responseInternalServerErrorCode).send({ message: errorMessage500 });
    });
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
    .catch(() => (err: Error) => {
      if (err.name === 'ValidationError') {
        res.status(responseIncorrectDataCode).send({ message: errorMessage400 });
      } else res.status(responseInternalServerErrorCode).send({ message: errorMessage500 });
    });
};

export const login = (req: IRequest, res: Response) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => res.send({
      token: jwt.sign({ _id: user._id }, secretKey, { expiresIn: '7d' }),
    }))
    .catch((error) => {
      if (error.message === 'UnauthorizedError') {
        return res.status(responseUnauthorizedDataCode).send({ message: errorMessage401 });
      }
      return res.status(responseInternalServerErrorCode).send({ message: errorMessage500 });
    });
};
