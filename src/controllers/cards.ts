import { NextFunction, Request, Response } from 'express';
import ForbiddenError from '../erorrs/err-forbidden';
import { IRequest } from '../utils/types';
import {
  errorMessage404,
  errorMessage400,
  errorMessage403,
} from '../utils/constants';
import Card from '../models/card';
import BadRequest from '../erorrs/err-bad-request';
import DataNotFoundError from '../erorrs/err-not-found';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .populate('owner', 'name about avatar')
  .populate('likes', 'name about avatar')
  .then((cards) => res.send({ data: cards }))
  .catch((err) => next(err));

export const createCard = (req: IRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  return Card.create({
    name, link, owner: req.user?._id, runValidators: true,
  })
    .then((card) => res.send({ data: card }))
    .catch((err: Error) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest(errorMessage400));
      }

      return next(err);
    });
};

export const deleteCard = (req: IRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new DataNotFoundError(errorMessage404);
      }
      if (card.owner.toString() !== userId) {
        throw new ForbiddenError(errorMessage403);
      }
      return Card.findByIdAndDelete(cardId)
        .then(() => res.send({ message: 'Карточка успешно удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest(errorMessage400));
      }
      return next(err);
    });
};
export const likeCard = (req: IRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate('likes', 'name about avatar')
    .then((card) => {
      if (!card) {
        throw new DataNotFoundError(errorMessage404);
      }
      return res.send({ data: card });
    })
    .catch((err: Error) => {
      if (err.name === 'CastError') {
        return next(new BadRequest(errorMessage400));
      }
      return next(err);
    });
};
export const dislikeCard = (req: IRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new DataNotFoundError(errorMessage404);
      }
      return res.send({ data: card });
    })
    .catch((err: Error) => {
      if (err.name === 'CastError') {
        return next(new BadRequest(errorMessage400));
      }
      return next(err);
    });
};
