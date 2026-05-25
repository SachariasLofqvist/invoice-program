import express from "express";
import { clerkMiddleware, getAuth } from "@clerk/express"; // <-- NYA IMPORTER
import {
  getInvoices,
  createInvoice,
  getInvoiceById,
  addItemToInvoice,
} from "../controllers/invoiceContoller.js";

const router = express.Router();

router.use(clerkMiddleware());

const requireLogin = (req, res, next) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Du måste vara inloggad." });
  }

  next();
};

router.get("/", requireLogin, getInvoices);
router.post("/", requireLogin, createInvoice);
router.get("/:id", requireLogin, getInvoiceById);
router.post("/:id/items", requireLogin, addItemToInvoice);

export default router;
