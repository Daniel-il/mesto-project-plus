import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import BadRequest from '../erorrs/err-bad-request';
import DataNotFoundError from '../erorrs/err-not-found';
import { IError, IRequest } from '../utils/types';
import User from '../models/user';
import ConflictError from '../erorrs/err-conflict';
import {
  errorMessage404,
  responseDataNotFoundCode,
  errorMessage400,
  responseDataCreated,
  secretKey,
} from '../utils/constants';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch((err) => next(err));

export const createUser = (req: Request, res: Response, next: NextFunction) => {
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
    .catch((err: IError) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с такой почтой уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequest(errorMessage400));
      }
      return next(err);
    });
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.params;
  return User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new DataNotFoundError(errorMessage404);
      } else {
        res.send({ data: user });
      }
    })
    .catch(() => (err: Error) => {
      if (err.name === 'CastError') {
        return next(new BadRequest(errorMessage400));
      }
      return next(err);
    });
};

export const getCurrentUser = (req: IRequest, res: Response, next: NextFunction) => {
  User.findById(req.user?._id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => next(err));
};

export const updateUserData = (req: IRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user?._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new DataNotFoundError(errorMessage404);
      } else {
        res.send({ data: user });
      }
    })
    .catch((err: Error) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest(errorMessage400));
      }
      return next(err);
    });
};

export const updateUserAvatar = (req: IRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user?._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res.status(responseDataNotFoundCode).send({ message: errorMessage404 });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err: Error) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest(errorMessage400));
      }
      return next(err);
    });
};

export const login = (req: IRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => res.send({
      token: jwt.sign({ _id: user._id }, secretKey, { expiresIn: '7d' }),
    }))
    .catch((error) => next(error));
};
