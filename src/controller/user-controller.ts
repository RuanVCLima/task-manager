import { Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { z } from 'zod';
import { UserRole } from '../../generated/prisma/enums';
import { prisma } from '../database/prisma';
import { hash } from 'bcrypt';

class UserController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2, 'Name is required'),
      email: z.email({ message: 'Email is required' }).toLowerCase(),
      password: z
        .string()
        .min(6, { message: 'Password must have at least 6 characteres' }),
      role: z.enum(UserRole).default(UserRole.member),
    });

    const { name, email, password, role } = bodySchema.parse(request.body);

    const userWithSameEmail = await prisma.users.findFirst({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new AppError('Email alredy exists');
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.status(201).json(userWithoutPassword);
  }
}

export { UserController };
