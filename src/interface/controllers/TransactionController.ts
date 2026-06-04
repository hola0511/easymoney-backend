import { Request, Response } from "express";
import { TransactionType } from "@prisma/client";
import { prisma } from "../../infrastructure/database/prisma";

export class TransactionController {
  async index(req: Request, res: Response) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const queryType = req.query.type ? String(req.query.type) : undefined;
    const skip = (page - 1) * limit;

    const type =
      queryType === "INCOME"
        ? TransactionType.INCOME
        : queryType === "EXPENSE"
          ? TransactionType.EXPENSE
          : undefined;

    const where = {
      userId: req.user!.id,
      ...(type ? { type } : {}),
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          date: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.transaction.count({
        where,
      }),
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
    const id = String(req.params.id);

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
      include: {
        category: true,
      },
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transacción no encontrada",
      });
    }

    return res.json(transaction);
  }

  async create(req: Request, res: Response) {
    const { description, amount, type, date, categoryId } = req.body;

    const category = await prisma.category.findFirst({
      where: {
        id: String(categoryId),
        userId: req.user!.id,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Categoría no encontrada",
      });
    }

    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount,
        type,
        date: new Date(date),
        userId: req.user!.id,
        categoryId: String(categoryId),
      },
      include: {
        category: true,
      },
    });

    return res.status(201).json(transaction);
  }

  async update(req: Request, res: Response) {
    const id = String(req.params.id);
    const { description, amount, type, date, categoryId } = req.body;

    const transactionExists = await prisma.transaction.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!transactionExists) {
      return res.status(404).json({
        message: "Transacción no encontrada",
      });
    }

    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: String(categoryId),
          userId: req.user!.id,
        },
      });

      if (!category) {
        return res.status(404).json({
          message: "Categoría no encontrada",
        });
      }
    }

    const transaction = await prisma.transaction.update({
      where: {
        id,
      },
      data: {
        description,
        amount,
        type,
        date: new Date(date),
        categoryId: String(categoryId),
      },
      include: {
        category: true,
      },
    });

    return res.json(transaction);
  }

  async delete(req: Request, res: Response) {
    const id = String(req.params.id);

    const transactionExists = await prisma.transaction.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!transactionExists) {
      return res.status(404).json({
        message: "Transacción no encontrada",
      });
    }

    await prisma.transaction.delete({
      where: {
        id,
      },
    });

    return res.status(204).send();
  }
}