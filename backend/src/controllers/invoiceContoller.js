import { prisma } from "../../lib/prisma.js";

export const getInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
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
  try {
    const { title, number, paymentTerms, clientId } = req.body;

    const newInvoice = await prisma.invoice.create({
      data: {
        title,
        number,
        paymentTerms,
        clientId: clientId ? Number(clientId) : null,
      },
    });

    res.status(201).json(newInvoice);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Kunde inte skapa fakturan." });
  }
};

export const getInvoiceById = async (req, res) => {
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
