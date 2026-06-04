import { z } from 'zod';

export const createTransactionSchema = z.object({
  body: z.object({
    description: z.string().min(2, 'La descripción es requerida'),
    amount: z.coerce.number().positive('El monto debe ser mayor a 0'),
    type: z.enum(['INCOME', 'EXPENSE']),
    date: z.string().datetime('La fecha debe estar en formato ISO'),
    categoryId: z.string().uuid('Categoría inválida'),
  }),
});

export const updateTransactionSchema = z.object({
  params: z.object({ id: z.string().uuid('ID inválido') }),
  body: z.object({
    description: z.string().min(2).optional(),
    amount: z.coerce.number().positive().optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    date: z.string().datetime().optional(),
    categoryId: z.string().uuid().optional(),
  }),
});

export const transactionQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    categoryId: z.string().uuid().optional(),
    search: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});
