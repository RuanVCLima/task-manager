import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../database/prisma';

class TeamMembersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      userId: z.uuid(),
      teamsId: z.uuid(),
    });

    const { userId, teamsId } = bodySchema.parse(request.body);

    const teamMember = await prisma.teamMembers.create({
      data: {
        userId,
        teamsId,
      },
    });

    return response.status(201).json(teamMember);
  }

  async index(request: Request, response: Response) {
    const bodySchema = z.object({
      teamsId: z.uuid(),
    });

    const { teamsId } = bodySchema.parse(request.body);

    const teamsMembers = await prisma.teamMembers.findMany({
      where: {
        teamsId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: { users: true },
    });

    return response.status(201).json(teamsMembers);
  }

  async delete(request: Request, response: Response) {
    const bodySchema = z.object({
      userId: z.uuid(),
      teamsId: z.uuid(),
    });

    const { userId, teamsId } = bodySchema.parse(request.body);

    await prisma.teamMembers.delete({
      where: {
        userId_teamsId: {
          userId,
          teamsId,
        },
      },
    });

    return response.status(201).json();
  }
}

export { TeamMembersController };
