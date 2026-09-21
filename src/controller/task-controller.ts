import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../database/prisma';

class TaskController {
  async create(request: Request, response: Response) {
    const StatusEnum = z.enum(['pending', 'inProgress', 'completed']);

    const PriorityEnum = z.enum(['high', 'medium', 'low']);
    const bodySchema = z.object({
      title: z.string().min(1, 'title is required'),
      description: z.string().min(1, 'description is required'),
      status: StatusEnum,
      priority: PriorityEnum,
      assignedTo: z.uuid(),
      teamId: z.uuid(),
    });

    const { title, description, status, priority, assignedTo, teamId } =
      bodySchema.parse(request.body);

    const task = await prisma.tasks.create({
      data: {
        title,
        description,
        status,
        priority,
        assignedTo,
        teamId,
      },
    });

    return response.json(task);
  }

  async index(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const task = await prisma.tasks.findMany({
      where: {
        id,
      },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    return response.json(task);
  }

  async show(request: Request, response: Response) {
    const querySchema = z.object({
      assignedTo: z.uuid(),
    });

    const { assignedTo } = querySchema.parse(request.query);
    const task = await prisma.tasks.findMany({
      where: {
        assignedTo,
      },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    return response.json(task);
  }
}

export { TaskController };
