import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

export default function InvoiceForm({ onClose, onInvoiceCreated }) {
  const [title, setTitle] = useState("");
  const [number, setNumber] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("30 dagar");
  const [dueDate, setDueDate] = useState("");
  const [vatRate, setVatRate] = useState("25");
  const [lateFee, setLateFee] = useState("8");

  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerOrgNr, setCustomerOrgNr] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    const days = parseInt(paymentTerms);

    if (!isNaN(days)) {
      const today = new Date();
      today.setDate(today.getDate() + days);

      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");

      setDueDate(`${yyyy}-${mm}-${dd}`);
    }
  }, [paymentTerms]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const token = await getToken();

      const response = await axios.post(
        `${API_URL}/api/invoices`,
        {
          title,
          number,
          paymentTerms,
          dueDate,
          vatRate: Number(vatRate),
          lateFee: Number(lateFee),
          customerName,
          customerAddress,
          customerOrgNr,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      onInvoiceCreated(response.data);
      onClose();
    } catch (error) {
      console.error("Kunde inte skapa faktura:", error);
      alert("Något gick fel när fakturan skulle sparas.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Skapa ny faktura</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-2 mb-4">
              Fakturadetaljer
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fakturarubrik
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="t.ex. Webbutveckling april"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fakturanummer
                </label>
                <input
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="t.ex. INV-1002"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Betalningsvillkor
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="14 dagar">14 dagar</option>
                  <option value="30 dagar">30 dagar</option>
                  <option value="60 dagar">60 dagar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Förfallodag (Beräknad)
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Moms (%)
                </label>
                <select
                  value={vatRate}
                  onChange={(e) => setVatRate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="25">25%</option>
                  <option value="12">12%</option>
                  <option value="6">6%</option>
                  <option value="0">0% (Momsfri)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dröjsmålsränta (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={lateFee}
                  onChange={(e) => setLateFee(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-2 mb-4">
              Kunduppgifter
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Företagsnamn / Kundnamn
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="t.ex. Festments AB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postadress (Gata, Postnr, Ort)
                </label>
                <textarea
                  required
                  rows="2"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="t.ex. Storgatan 1&#10;123 45 Staden"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organisationsnummer (Frivilligt)
                </label>
                <input
                  type="text"
                  value={customerOrgNr}
                  onChange={(e) => setCustomerOrgNr(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="t.ex. 556XXX-XXXX"
                />
              </div>
            </div>
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
