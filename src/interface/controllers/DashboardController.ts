import { Request, Response } from 'express';
import { prisma } from '../../infrastructure/database/prisma';

function toNumber(value: unknown): number {
  if (typeof value === 'object' && value !== null && 'toNumber' in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value || 0);
}

export class DashboardController {
  async summary(req: Request, res: Response) {
    const userId = req.user!.id;

    const [income, expense, count, categoryTotals] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId, type: 'INCOME' },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, type: 'EXPENSE' },
        _sum: { amount: true },
      }),
      prisma.transaction.count({ where: { userId } }),
      prisma.transaction.groupBy({
        by: ['categoryId'],
        where: { userId, type: 'EXPENSE' },
        _sum: { amount: true },
      }),
    ]);

    const categories = await prisma.category.findMany({
      where: { userId, id: { in: categoryTotals.map((item) => item.categoryId) } },
    });

    const totalIncome = toNumber(income._sum.amount);
    const totalExpense = toNumber(expense._sum.amount);

    return res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: count,
      expensesByCategory: categoryTotals.map((item) => ({
        categoryId: item.categoryId,
        category: categories.find((category) => category.id === item.categoryId)?.name || 'Sin categoría',
        total: toNumber(item._sum.amount),
      })),
    });
  }
}
