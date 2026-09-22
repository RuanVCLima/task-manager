import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../database/prisma';
import { AppError } from '../utils/AppError';

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

    return response.status(201).json(task);
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

    if (task.length === 0) {
      throw new AppError('There is no task with this id');
    }

    return response.status(201).json(task);
  }

  async show(request: Request, response: Response) {
    const StatusEnum = z.enum(['pending', 'inProgress', 'completed']);
    const PriorityEnum = z.enum(['high', 'medium', 'low']);
    const querySchema = z.object({
      assignedTo: z.uuid().optional(),
      status: StatusEnum.optional(),
      priority: PriorityEnum.optional(),
    });

    const { assignedTo, status, priority } = querySchema.parse(request.query);
    const task = await prisma.tasks.findMany({
      where: {
        ...(assignedTo !== undefined && { assignedTo }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
      },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    if (task.length === 0) {
      throw new AppError('Task not found');
    }

    return response.status(201).json(task);
  }

  async update(request: Request, response: Response) {
    const StatusEnum = z.enum(['pending', 'inProgress', 'completed']);

    const PriorityEnum = z.enum(['high', 'medium', 'low']);
    const bodySchema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      status: StatusEnum,
      priority: PriorityEnum.optional(),
      assignedTo: z.uuid().optional(),
      teamId: z.uuid().optional(),
    });

    const paramsSchema = z.object({
      id: z.uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    if (!request.user || !request.user.role) {
      throw new AppError('Unauthorized');
    }

    const { id: userTaskId, role } = request.user;

    const task = await prisma.tasks.findFirst({ where: { id } });

    if (!task) {
      throw new AppError('There is no task with this id');
    }

    if (role !== 'admin' && task.assignedTo !== userTaskId) {
      throw new AppError('You can only update tasks assigned to you');
    }

    const { title, description, status, priority, assignedTo, teamId } =
      bodySchema.parse(request.body);

    const taskUpdate = await prisma.tasks.update({
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(assignedTo !== undefined && { assignedTo }),
        ...(assignedTo !== undefined && { teamId }),
      },
      where: { id },
    });

    const taskHistory = await prisma.tasksHistory.findFirst({
      where: { taskId: id },
      orderBy: {
        changedBy: 'desc',
      },
    });

    if (!taskHistory) {
      await prisma.tasksHistory.create({
        data: {
          taskId: id,
          changedBy: userTaskId,
          newStatus: status,
        },
      });
    }

    await prisma.tasksHistory.create({
      data: {
        taskId: id,
        changedBy: userTaskId,
        oldStatus: taskHistory?.newStatus,
        newStatus: status,
      },
    });

    return response.status(201).json(taskUpdate);
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    await prisma.tasks.delete({ where: { id } });

    return response.status(201).json();
  }
}

export { TaskController };
