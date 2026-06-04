import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../middlewares/authMiddleware";
import { uploadBankStatement } from "../controllers/bankStatement.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadBankStatement
);

export { router as bankStatementRoutes };