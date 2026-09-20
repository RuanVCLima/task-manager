import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../database/prisma';

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
    return response.json(teams);
  }

  async index(request: Request, response: Response) {
    const querySchema = z.object({
      name: z.string(),
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

    response.json(teams);
  }

  async update(request: Request, response: Response) {
    const bodySchema = z.object({
      id: z.uuid(),
      name: z.string().trim().min(1, 'name is required'),
      description: z.string(),
      userId: z.uuid(),
    });

    const { id, name, description, userId } = bodySchema.parse(request.body);

    const teams = await prisma.teams.update({
      data: {
        name,
        description,
        userId,
      },
      where: { id },
    });

    return response.json(teams);
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    await prisma.teams.delete({ where: { id } });

    return response.status(201).json();
  }
}

export { TeamsController };
