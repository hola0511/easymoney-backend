import { Request, Response } from "express";
import { prisma } from "../../infrastructure/database/prisma";

export class CategoryController {
  async index(req: Request, res: Response) {
    const categories = await prisma.category.findMany({
      where: {
        userId: req.user!.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(categories);
  }

  async show(req: Request, res: Response) {
    const id = String(req.params.id);

    const category = await prisma.category.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Categoría no encontrada",
      });
    }

    return res.json(category);
  }

  async create(req: Request, res: Response) {
    const { name, type } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        type,
        userId: req.user!.id,
      },
    });

    return res.status(201).json(category);
  }

  async update(req: Request, res: Response) {
    const id = String(req.params.id);
    const { name, type } = req.body;

    const categoryExists = await prisma.category.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!categoryExists) {
      return res.status(404).json({
        message: "Categoría no encontrada",
      });
    }

    const category = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
        type,
      },
    });

    return res.json(category);
  }

  async delete(req: Request, res: Response) {
    const id = String(req.params.id);

    const categoryExists = await prisma.category.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!categoryExists) {
      return res.status(404).json({
        message: "Categoría no encontrada",
      });
    }

    await prisma.category.delete({
      where: {
        id,
      },
    });

    return res.status(204).send();
  }
}