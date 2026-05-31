import "dotenv/config";
import express from "express";
import cors from "cors";
import invoiceRoutes from "./routes/invoiceRoutes.js";

const app = express();
const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/invoices", invoiceRoutes);

app.listen(PORT, () => {
  console.log(`Server körs på http://localhost:${PORT}`);
});
