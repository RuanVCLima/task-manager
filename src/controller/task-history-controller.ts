import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../database/prisma';
import { AppError } from '../utils/AppError';

class TaskHistoryController {
  async index(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid('id is required'),
    });

    const { id } = paramsSchema.parse(request.params);

    const taskHistory = await prisma.tasksHistory.findMany({
      where: {
        taskId: id,
      },
      orderBy: { changedtAt: 'desc' },
    });

    if (taskHistory.length === 0) {
      throw new AppError('Task not found');
    }

    return response.json(taskHistory);
  }
}

export { TaskHistoryController };
