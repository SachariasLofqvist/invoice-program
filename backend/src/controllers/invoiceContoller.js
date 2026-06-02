import { getAuth } from "@clerk/express";
import { prisma } from "../../lib/prisma.js";

export const getInvoices = async (req, res) => {
  const { userId } = getAuth(req);

  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        clerkUserID: userId,
      },
      include: {
        client: true,
      },
    });
    res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kunde inte hämta fakturor." });
  }
};

export const createInvoice = async (req, res) => {
  const { userId } = getAuth(req);
  try {
    const {
      title,
      number,
      paymentTerms,
      clientId,
      dueDate,
      vatRate,
      lateFee,
      customerName,
      customerAddress,
      customerOrgNr,
      reff,
      notes,
    } = req.body;

    const parsedDueDate = dueDate ? new Date(dueDate) : null;

    const newInvoice = await prisma.invoice.create({
      data: {
        title,
        number,
        paymentTerms,
        clientId: clientId ? Number(clientId) : null,
        dueDate: parsedDueDate,
        vatRate: vatRate ? Number(vatRate) : 25,
        defaultInterest: lateFee ? Number(lateFee) : 8,
        customerName,
        customerAddress,
        customerOrgNr,
        reff,
        notes,
        clerkUserID: userId,
      },
    });

    res.status(201).json(newInvoice);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Kunde inte skapa fakturan." });
  }
};

export const getInvoiceById = async (req, res) => {
  const { userId } = getAuth(req);

  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        client: true,
        items: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: "Fakturan kunde inte hittas." });
    }

    if (invoice.clerkUserID !== userId) {
      return res
        .status(403)
        .json({ error: "Du har inte tillåtelse att se denna faktura." });
    }

    res.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Kunde inte hämta fakturadetaljer." });
  }
};

export const addItemToInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, quantity, unitPrice } = req.body;

    const qty = Number(quantity) || 1;
    const price = Number(unitPrice) || 0;
    const netAmount = qty * price;

    const newItem = await prisma.item.create({
      data: {
        title,
        description,
        quantity: qty,
        unitPrice: price,
        netAmount,
        invoiceId: Number(id),
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Kunde inte skapa fakturaraden." });
  }
};
