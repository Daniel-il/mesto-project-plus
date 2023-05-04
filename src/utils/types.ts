import { Request } from 'express';

export interface IRequest extends Request {
    user?: Record<string, string>;
  }
export interface IError extends Error {
    statusCode: number;
    code?: number;
  }
