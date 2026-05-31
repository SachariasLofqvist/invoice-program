import "dotenv/config";
import express from "express";
import cors from "cors";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 8080;

const corsOptions = {
  origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_API],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet())

app.use((err, req, res, next) => {
  console.error("Oväntat fel:", err.message);
  res.status(500).json({ error: "Ett internt serverfel inträffade." });
});

app.use("/api/invoices", invoiceRoutes);

app.listen(PORT, () => {
  console.log(`Server körs på http://localhost:${PORT}`);
});
