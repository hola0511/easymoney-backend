import { Request, Response } from "express";
import { parse } from "csv-parse/sync";
import { prisma } from "../../infrastructure/database/prisma";

type BankStatementRow = {
  date: string;
  description: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category: string;
};

export async function uploadBankStatement(req: Request, res: Response) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Debes subir un archivo CSV",
      });
    }

    const csvContent = req.file.buffer.toString("utf-8");

    const rows = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as BankStatementRow[];

    if (!rows.length) {
      return res.status(400).json({
        message: "El archivo está vacío",
      });
    }

    const createdTransactions = [];

    for (const row of rows) {
      if (
        !row.date ||
        !row.description ||
        !row.amount ||
        !row.type ||
        !row.category
      ) {
        continue;
      }

      const amount = Number(row.amount);

      if (Number.isNaN(amount) || amount <= 0) {
        continue;
      }

      if (row.type !== "INCOME" && row.type !== "EXPENSE") {
        continue;
      }

      let category = await prisma.category.findFirst({
        where: {
          name: row.category,
          type: row.type,
          userId: user.id,
        },
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: row.category,
            type: row.type,
            userId: user.id,
          },
        });
      }

      const transaction = await prisma.transaction.create({
        data: {
          description: row.description,
          amount,
          type: row.type,
          date: new Date(row.date),
          userId: user.id,
          categoryId: category.id,
        },
        include: {
          category: true,
        },
      });

      createdTransactions.push(transaction);
    }

    return res.status(201).json({
      message: "Extracto procesado correctamente",
      totalRows: rows.length,
      created: createdTransactions.length,
      transactions: createdTransactions,
    });
  } catch (error) {
    return res.status(500).json({
      message: "No se pudo procesar el extracto bancario",
    });
  }
}