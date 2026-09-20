import { Request, Response } from 'express';

class TeamsController {
  async create(request: Request, response: Response) {
    return response.json({ message: 'ok' });
  }
}

export { TeamsController };
