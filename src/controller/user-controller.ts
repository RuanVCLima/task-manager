import { Request, Response } from 'express';
import { AppError } from '../utils/AppError';

class UserController {
  async create(request: Request, response: Response) {
    throw new AppError('Teste', 400);
    return response.json({ message: 'ok' });
  }
}

export { UserController };
