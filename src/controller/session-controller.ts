import { Request, Response } from 'express';
import { prisma } from '../database/prisma';
import { z } from 'zod';
import { AppError } from '../utils/AppError';
import { compare } from 'bcrypt';
import { authConfig } from '../configs/auth';
import { sign } from 'jsonwebtoken';

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.email(),
      password: z.string().trim().min(6, 'Password is required'),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.users.findFirst({ where: { email } });

    if (!user) {
      throw new AppError('Email or password is wrong');
    }

    const validatedPassword = await compare(password, user.password);

    if (!validatedPassword) {
      throw new AppError('Email or password is wrong');
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ role: user.role ?? 'member' }, secret, {
      subject: user.id,
      expiresIn,
    });

    const { password: hashedPassword, ...userWithoutPassword } = user;

    return response.status(200).json({ token, user: userWithoutPassword });
  }
}

export { SessionsController };
