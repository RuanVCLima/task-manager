import { Request, Response } from 'express';
import { z } from 'zod';
import { AppError } from '../utils/AppError';
import { prisma } from '../database/prisma';

class TeamMembersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      userId: z.uuid(),
      teamsId: z.uuid(),
    });

    const { userId, teamsId } = bodySchema.parse(request.body);

    // if (!userId || !teamsId) {
    //   throw new AppError('UserId and Teamsid are required');
    // }
    console.log('2 - validation passed');
    console.log({ userId, teamsId });

    const teamMember = await prisma.teamMembers.create({
      data: {
        userId,
        teamsId,
      },
    });

    if (!teamMember) {
      throw new AppError('user and team does not exist!');
    }

    console.log('3 - database insert completed');
    return response.status(201).json(teamMember);
  }
}

export { TeamMembersController };
