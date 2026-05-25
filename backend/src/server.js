import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import invoiceRoutes from './routes/invoiceRoutes.js'

const app = express();
const PORT = process.env.PORT || 8080

app.use(cors());
app.use(express.json());

app.use('/api/invoices', invoiceRoutes)

app.listen(PORT, () => {
    console.log(`Server körs på http://localhost:${PORT}`);
})