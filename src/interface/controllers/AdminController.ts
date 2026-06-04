import { Request, Response } from 'express';
import { prisma } from '../../infrastructure/database/prisma';

export class AdminController {
  async users(_req: Request, res: Response) {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(users);
  }
}
