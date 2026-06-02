import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

export default function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();

  const myBank = import.meta.env.VITE_COMPANY_BANK;
  const clearing = import.meta.env.VITE_COMPANY_CLEARING;
  const companyAcc = import.meta.env.VITE_COMPANY_ACCOUNT;
  const companySwish = import.meta.env.VITE_COMPANY_SWISH;
  const orgNumber = import.meta.env.VITE_COMPANY_ORGNUMBER;
  const momsNumber = import.meta.env.VITE_COMPANY_MOMSNUMBER;
  const companyAdress = import.meta.env.VITE_COMPANY_ADDRESS;
  const companyPostcode = import.meta.env.VITE_COMPANY_POSTCODE;
  const companyEmail = import.meta.env.VITE_COMPANY_EMAIL;
  const companyOwner = import.meta.env.VITE_COMPANY_OWNERNAME;
  const companyName = import.meta.env.VITE_COMPANY_NAME;

  const [itemTitle, setItemTitle] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemPrice, setItemPrice] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
        const token = await getToken();
        const response = await axios.get(`${API_URL}/api/invoices/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvoice(response.data);
      } catch (err) {
        console.error(err);
        setError("Kunde inte hämta fakturainformationen.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoiceDetails();
  }, [id, getToken]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    setIsAddingItem(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const token = await getToken();
      const response = await axios.post(
        `${API_URL}/api/invoices/${id}/items`,
        { title: itemTitle, quantity: itemQuantity, unitPrice: itemPrice },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setInvoice({ ...invoice, items: [...invoice.items, response.data] });
      setItemTitle("");
      setItemQuantity(1);
      setItemPrice("");
    } catch (err) {
      console.error(err);
      alert("Det gick inte att lägga till fakturaraden.");
    } finally {
      setIsAddingItem(false);
    }
  };

  const calculateNetTotal = () => {
    if (!invoice?.items) return 0;
    return invoice.items.reduce((sum, item) => sum + Number(item.netAmount), 0);
  };

  const netTotal = calculateNetTotal();
  const invoiceVatRate =
    invoice?.vatRate !== undefined ? Number(invoice.vatRate) : 25;
  const vatAmount = netTotal * (invoiceVatRate / 100);
  const grossTotal = netTotal + vatAmount;

  const handlePrint = () => window.print();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Laddar fakturadetaljer...
      </div>
    );
  if (error || !invoice)
    return <div className="text-center py-12 text-red-500">{error}</div>;

  const invoiceDate = new Date(invoice.dateCreated).toLocaleDateString("sv-SE");
  const dueDateFormatted = invoice.dueDate
    ? new Date(invoice.dueDate).toLocaleDateString("sv-SE")
    : "-";

  return (
    <div className="bg-gray-200 min-h-screen py-8 print:py-0 print:bg-white text-sm">
      
      <div className="max-w-[210mm] mx-auto mb-4 flex justify-between items-center print:hidden px-4 sm:px-0">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          &larr; Tillbaka till översikten
        </Link>
        <button
          onClick={handlePrint}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-md font-semibold shadow-sm cursor-pointer"
        >
          Spara som PDF
        </button>
      </div>

      <div className="max-w-[210mm] mx-auto bg-white p-[20mm] shadow-lg min-h-[297mm] flex flex-col print:shadow-none print:p-[20mm] print:min-h-[290mm] print:m-0">
        <header className="flex justify-between items-start mb-12">
          <div className="text-gray-600">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {companyName}
            </h1>
            <p>{companyAdress}</p>
            <p>{companyPostcode}</p>
            <br />
            <p>Org.nr: {orgNumber}</p>
            <p>Momsreg.nr: {momsNumber}</p>
          </div>
          <div className="text-right text-gray-600">
            <h2 className="text-4xl font-light text-gray-900 mb-6 tracking-wider">
              FAKTURA
            </h2>
            <div className="bg-gray-50 p-4 text-left inline-block min-w-55 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-1">
                {invoice.customerName || "Ny Kund AB"}
              </h3>
              <p className="whitespace-pre-wrap text-sm">
                {invoice.customerAddress || "Kundgatan 1\n123 45 Staden"}
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12 border-b border-t border-gray-200 py-4">
          <div>
            <p className="text-gray-500 font-semibold text-xs uppercase">
              Fakturanummer
            </p>
            <p className="font-medium text-gray-900">{invoice.number}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold text-xs uppercase">
              Fakturadatum
            </p>
            <p className="font-medium text-gray-900">{invoiceDate}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold text-xs uppercase">
              Betalningsvillkor
            </p>
            <p className="font-medium text-gray-900">{invoice.paymentTerms}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold text-xs uppercase">
              Förfallodag
            </p>
            <p className="font-medium text-gray-900">
              {dueDateFormatted || "-"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold text-xs uppercase">
              Dröjsmålsränta
            </p>
            <p className="font-medium text-gray-900">
              {invoice.lateFee !== undefined ? invoice.lateFee : 8}%
            </p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold text-xs uppercase">
              Köparens referens
            </p>
            <p className="font-medium text-gray-900">
              {invoice.reff || "-"}
            </p>
          </div>
        </div>

        <div className="w-full mb-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-800 text-gray-800">
                <th className="py-2 font-semibold">Beskrivning</th>
                <th className="py-2 font-semibold text-center hidden sm:table-cell">
                  Datum
                </th>
                <th className="py-2 font-semibold text-right">Antal</th>
                <th className="py-2 font-semibold text-center">Enhet</th>
                <th className="py-2 font-semibold text-right">À pris</th>
                <th className="py-2 font-semibold text-right">Moms %</th>
                <th className="py-2 font-semibold text-right">Belopp</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {invoice.items && invoice.items.length > 0 ? (
                invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3">{item.title}</td>
                    <td className="py-3 text-center hidden sm:table-cell">
                      {invoiceDate}
                    </td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-center">st</td>
                    <td className="py-3 text-right">
                      {Number(item.unitPrice).toLocaleString("sv-SE", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      kr
                    </td>
                    <td className="py-3 text-right">{invoiceVatRate}%</td>
                    <td className="py-3 text-right font-medium">
                      {Number(item.netAmount).toLocaleString("sv-SE", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      kr
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="py-8 text-center text-gray-400 italic"
                  >
                    Inga rader har lagts till ännu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="grow"></div>

        <div className="flex justify-end mb-12">
          <div className="w-full sm:w-1/2 md:w-1/3">
            <div className="flex justify-between py-1 text-gray-600">
              <span>Totalt exkl moms</span>
              <span>
                {netTotal.toLocaleString("sv-SE", { minimumFractionDigits: 2 })}{" "}
                kr
              </span>
            </div>
            <div className="flex justify-between py-1 text-gray-600">
              <span>Moms {invoiceVatRate}%</span>
              <span>
                {vatAmount.toLocaleString("sv-SE", {
                  minimumFractionDigits: 2,
                })}{" "}
                kr
              </span>
            </div>
            <div className="flex justify-between py-3 mt-2 border-t-2 border-gray-800 font-bold text-lg text-gray-900">
              <span>Summa att betala</span>
              <span>
                {grossTotal.toLocaleString("sv-SE", {
                  minimumFractionDigits: 2,
                })}{" "}
                kr
              </span>
            </div>
          </div>
        </div>

        <footer className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500 pt-8 border-t border-gray-200">
          <div>
            <p className="font-bold text-gray-700 mb-1">{companyName}</p>
            <p>{companyAdress}</p>
            <p>{companyPostcode}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700 mb-1">Kontakt</p>
            <p>{companySwish}</p>
            <p>{companyEmail}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700 mb-1">Betalningsuppgifter</p>
            <p>Bank: {myBank}</p>
            <p>Clearingnr: {clearing}</p>
            <p>Kontonr: {companyAcc}</p>
            <p>Swish: {companySwish}</p>
          </div>
          <div>
            <p className="font-bold text-gray-700 mb-1">Företagsinfo</p>
            <p>Org.nr: {orgNumber}</p>
            <p>Momsreg.nr: {momsNumber}</p>
            <p>Godkänd för F-skatt</p>
          </div>
        </footer>
      </div>

      <div className="max-w-[210mm] mx-auto mt-8 print:hidden">
        <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Lägg till ny rad
          </h3>
          <form
            onSubmit={handleAddItem}
            className="flex flex-col sm:flex-row items-end gap-4"
          >
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beskrivning
              </label>
              <input
                type="text"
                required
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full sm:w-24">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Antal
              </label>
              <input
                type="number"
                min="1"
                step="0.1"
                required
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full sm:w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                À-pris (kr)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={isAddingItem}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              + Lägg till
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}