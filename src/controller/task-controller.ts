import { Request, Response } from 'express';

class TaskController {
  async create(request: Request, response: Response) {
    return response.json({ message: 'ok' });
  }
}

export { TaskController };
