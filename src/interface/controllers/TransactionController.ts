import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../infrastructure/database/prisma';
import { AppError } from '../../shared/errors/AppError';

export class TransactionController {
  async index(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;
    const { type, categoryId, search, startDate, endDate } = req.query;

    const where: Prisma.TransactionWhereInput = {
      userId: req.user!.id,
      ...(type ? { type: type as 'INCOME' | 'EXPENSE' } : {}),
      ...(categoryId ? { categoryId: String(categoryId) } : {}),
      ...(search
        ? { description: { contains: String(search), mode: 'insensitive' } }
        : {}),
      ...((startDate || endDate)
        ? {
            date: {
              ...(startDate ? { gte: new Date(String(startDate)) } : {}),
              ...(endDate ? { lte: new Date(String(endDate)) } : {}),
            },
          }
        : {}),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: { category: true },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return res.json({
      data: transactions,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  }

  async show(req: Request, res: Response) {
    const transaction = await prisma.transaction.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
      include: { category: true },
    });

    if (!transaction) throw new AppError('Transacción no encontrada', 404);
    return res.json(transaction);
  }

  async create(req: Request, res: Response) {
    const { description, amount, type, date, categoryId } = req.body;

    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId: req.user!.id, type },
    });

    if (!category) throw new AppError('Categoría no encontrada o no coincide con el tipo', 400);

    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount,
        type,
        date: new Date(date),
        categoryId,
        userId: req.user!.id,
      },
      include: { category: true },
    });

    return res.status(201).json(transaction);
  }

  async update(req: Request, res: Response) {
    const transaction = await prisma.transaction.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!transaction) throw new AppError('Transacción no encontrada', 404);

    if (req.body.categoryId || req.body.type) {
      const category = await prisma.category.findFirst({
        where: {
          id: req.body.categoryId || transaction.categoryId,
          userId: req.user!.id,
          type: req.body.type || transaction.type,
        },
      });

      if (!category) throw new AppError('Categoría no encontrada o no coincide con el tipo', 400);
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        ...(req.body.date ? { date: new Date(req.body.date) } : {}),
      },
      include: { category: true },
    });

    return res.json(updatedTransaction);
  }

  async delete(req: Request, res: Response) {
    const transaction = await prisma.transaction.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!transaction) throw new AppError('Transacción no encontrada', 404);

    await prisma.transaction.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  }
}
