import { Request, Response } from 'express';
import { prisma } from '../../infrastructure/database/prisma';
import { AppError } from '../../shared/errors/AppError';

export class CategoryController {
  async index(req: Request, res: Response) {
    const categories = await prisma.category.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(categories);
  }

  async show(req: Request, res: Response) {
    const category = await prisma.category.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!category) throw new AppError('Categoría no encontrada', 404);
    return res.json(category);
  }

  async create(req: Request, res: Response) {
    const { name, type } = req.body;

    const category = await prisma.category.create({
      data: { name, type, userId: req.user!.id },
    });

    return res.status(201).json(category);
  }

  async update(req: Request, res: Response) {
    const category = await prisma.category.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!category) throw new AppError('Categoría no encontrada', 404);

    const updatedCategory = await prisma.category.update({
      where: { id: req.params.id },
      data: req.body,
    });

    return res.json(updatedCategory);
  }

  async delete(req: Request, res: Response) {
    const category = await prisma.category.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!category) throw new AppError('Categoría no encontrada', 404);

    await prisma.category.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  }
}
