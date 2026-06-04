import express from "express";
import cors from "cors";

import { authRoutes } from "./interface/routes/auth.routes";
import { categoryRoutes } from "./interface/routes/category.routes";
import { transactionRoutes } from "./interface/routes/transaction.routes";
import { dashboardRoutes } from "./interface/routes/dashboard.routes";
import { adminRoutes } from "./interface/routes/admin.routes";
import { bankStatementRoutes } from "./interface/routes/bankStatement.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
  return res.status(200).json({
    status: "ok",
    message: "EasyMoney API is running",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/bank-statements", bankStatementRoutes);

app.use((_req, res) => {
  return res.status(404).json({
    message: "Ruta no encontrada",
  });
});

export { app };