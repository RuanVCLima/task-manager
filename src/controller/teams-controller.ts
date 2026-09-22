import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../database/prisma';
import { AppError } from '../utils/AppError';

class TeamsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(1, 'Name is required'),
      description: z.string(),
      userId: z.uuid(),
    });

    const { name, description, userId } = bodySchema.parse(request.body);

    const teams = await prisma.teams.create({
      data: {
        name,
        description,
        userId,
      },
    });
    return response.status(201).json(teams);
  }

  async index(request: Request, response: Response) {
    const querySchema = z.object({
      name: z.string().min(1, 'name is required'),
    });

    const { name } = querySchema.parse(request.query);

    const teams = await prisma.teams.findMany({
      where: {
        name: {
          contains: name.trim(),
        },
      },
      orderBy: { createAt: 'desc' },
      include: { users: true },
    });

    if (teams.length === 0) {
      throw new AppError('Team not found');
    }

    response.status(200).json(teams);
  }

  async update(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().optional(),
      description: z.string().optional(),
      userId: z.uuid().optional(),
    });

    const paramsSchema = z.object({
      id: z.uuid('id is required'),
    });

    const { id } = paramsSchema.parse(request.params);

    const { name, description, userId } = bodySchema.parse(request.body);

    const findTeams = await prisma.teams.findFirst({ where: { id } });

    if (!findTeams) {
      throw new AppError('Team not found');
    }

    const teams = await prisma.teams.update({
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(userId !== undefined && { userId }),
      },
      where: { id },
    });

    return response.status(200).json(teams);
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const findTeams = await prisma.teams.findFirst({ where: { id } });

    if (!findTeams) {
      throw new AppError('Team not found');
    }

    await prisma.teams.delete({ where: { id } });

    return response.status(200).json();
  }
}

export { TeamsController };
