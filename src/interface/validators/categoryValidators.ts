import { z } from 'zod';

export const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid('ID inválido') }),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'El nombre debe tener mínimo 2 caracteres'),
    type: z.enum(['INCOME', 'EXPENSE']),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({ id: z.string().uuid('ID inválido') }),
  body: z.object({
    name: z.string().min(2).optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
  }),
});
