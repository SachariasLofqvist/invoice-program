import { useState } from "react";
import axios from "axios";

export default function InvoiceForm({ onClose, onInvoiceCreated }) {
  const [title, setTitle] = useState("");
  const [number, setNumber] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("14 days");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await axios.post(`${API_URL}/api/invoices`, {
        title,
        number,
        paymentTerms,
      });

      onInvoiceCreated(response.data);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Något gick fel när fakturan skulle sparas.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Skapa ny faktura</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fakturarubrik
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="t.ex. Webbutveckling april"
            />
          </div>

          <div>
            <label
              htmlFor="number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fakturanummer
            </label>
            <input
              id="number"
              type="text"
              required
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="t.ex. INV-1002"
            />
          </div>

          <div>
            <label
              htmlFor="paymentTerms"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Betalningsvillkor
            </label>
            <select
              id="paymentTerms"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="14 days">14 dagar</option>
              <option value="30 days">30 dagar</option>
              <option value="60 days">60 dagar</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Sparar..." : "Spara faktura"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
