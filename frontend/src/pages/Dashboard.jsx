import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react"; // <-- VIKTIGT: För säkerheten
import InvoiceForm from "../components/InvoiceForm"; // <-- VIKTIGT: För att hitta din popup!

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getToken } = useAuth(); // Hämta nyckeln från Clerk

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const token = await getToken(); // Hämta säkerhetsnyckeln

        // Skicka anropet till backenden MED nyckeln
        const response = await axios.get(`${API_URL}/api/invoices`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvoices(response.data);
      } catch (error) {
        console.error("Kunde inte hämta fakturor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [getToken]);

  const handleInvoiceCreated = (newInvoice) => {
    setInvoices([newInvoice, ...invoices]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
        Laddar fakturor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Mina Fakturor</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            + Ny Faktura
          </button>
        </header>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {invoices.length === 0 ? (
              <li className="px-6 py-12 text-center text-gray-500">
                Du har inga fakturor än.
              </li>
            ) : (
              invoices.map((invoice) => (
                <li
                  key={invoice.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <Link
                    to={`/invoice/${invoice.id}`}
                    className="block px-6 py-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-medium text-blue-600 truncate">
                          {invoice.title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                          Fakturanummer: {invoice.number}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {invoice.status}
                        </span>
                        <p className="mt-1 text-sm text-gray-500">
                          {new Date(invoice.dateCreated).toLocaleDateString(
                            "sv-SE",
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <InvoiceForm
          onClose={() => setIsModalOpen(false)}
          onInvoiceCreated={handleInvoiceCreated}
        />
      )}
    </div>
  );
}
