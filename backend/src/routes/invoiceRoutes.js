import express from "express";
import {
  getInvoices,
  createInvoice,
  getInvoiceById,
  addItemToInvoice,
} from "../controllers/invoiceContoller.js";

const router = express.Router();

router.get("/", getInvoices);
router.post("/", createInvoice);
router.get("/:id", getInvoiceById);
router.post("/:id/items", addItemToInvoice);

export default router;
