import { Request, Response } from 'express';
import { IRequest } from '../app';
import {
  errorMessage404,
  responseDataNotFoundCode,
  responseInternalServerErrorCode,
  errorMessage500,
  responseIncorrectDataCode,
  errorMessage400,
} from '../utils/constants';
import Card from '../models/card';

export const getCards = (req: Request, res: Response) => Card.find({})
  .populate('owner', 'name about avatar')
  .populate('likes', 'name about avatar')
  .then((cards) => res.send({ data: cards }))
  .catch(() => res.status(responseInternalServerErrorCode).send({ message: errorMessage500 }));

export const createCard = (req: IRequest, res: Response) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.send({ data: card }))
    .catch(() => (err: Error) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: errorMessage400 });
      }

      return res.status(500).send({ message: errorMessage500 });
    });
};

export const deleteCard = (req: IRequest, res: Response) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res.status(responseDataNotFoundCode).send({ message: errorMessage404 });
      }
      return res.send({ message: 'Карточка успешно удалена' });
    })
    .catch(() => (err: Error) => {
      if (err.name === 'CastError') {
        res.status(responseIncorrectDataCode).send({ message: errorMessage400 });
      } else res.status(responseInternalServerErrorCode).send({ message: errorMessage500 });
    });
};
export const likeCard = (req: IRequest, res: Response) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user?._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .populate('likes', 'name about avatar')
  .then((card) => {
    if (!card) {
      return res.status(responseDataNotFoundCode).send({ message: errorMessage404 });
    }
    return res.send({ data: card });
  })
  .catch(() => (err: Error) => {
    if (err.name === 'CastError') {
      res.status(responseIncorrectDataCode).send({ message: errorMessage400 });
    } else res.status(responseInternalServerErrorCode).send({ message: errorMessage500 });
  });

export const dislikeCard = (req: IRequest, res: Response) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user?._id } }, // убрать _id из массива
  { new: true },
)
  .then((card) => {
    if (!card) {
      return res.status(responseDataNotFoundCode).send({ message: errorMessage404 });
    }
    return res.send({ data: card });
  })
  .catch(() => (err: Error) => {
    if (err.name === 'CastError') {
      res.status(responseIncorrectDataCode).send({ message: errorMessage400 });
    } else res.status(responseInternalServerErrorCode).send({ message: errorMessage500 });
  });
