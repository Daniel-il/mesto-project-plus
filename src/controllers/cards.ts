import { Request, Response } from "express";
import Card from "../models/card";
import { IRequest } from "app";

export const getCards = (req: Request, res: Response) => {
  return Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

export const createCard = (req: IRequest, res: Response) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

export const deleteCard = (req: IRequest, res: Response) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId).then((card) => {
    if (!card) {
      return res.status(404).send({ message: "Карточка не найдена" });
    } else {
      res.send({ message: "Карточка успешно удалена" });
    }
  });
};

export const likeCard = (req: IRequest, res: Response) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка не найдена" });
      }
      else {
        return res.send({ data: card });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const dislikeCard = (req: IRequest, res: Response) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Карточка не найдена" });
      } else {
        return res.send({ data: card });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
