import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';
import { secretKey } from '../utils/constants';
import UnauthorizedError from '../erorrs/err-unauthorized';

interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
