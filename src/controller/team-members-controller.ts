import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../database/prisma';
import { AppError } from '../utils/AppError';

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

    if (teamsMembers.length === 0) {
      throw new AppError('There is no teams with this id');
    }

    return response.status(201).json(teamsMembers);
  }

  async delete(request: Request, response: Response) {
    const bodySchema = z.object({
      userId: z.uuid(),
      teamsId: z.uuid(),
    });

    const { userId, teamsId } = bodySchema.parse(request.body);

    const teamMembers = await prisma.teamMembers.findUnique({
      where: {
        userId_teamsId: {
          userId,
          teamsId,
        },
      },
    });

    if (!teamMembers) {
      throw new AppError('This person in not on this team');
    }

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
