import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tillstånd för att lägga till en ny rad (Item)
  const [itemTitle, setItemTitle] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemPrice, setItemPrice] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/invoices/${id}`);
        setInvoice(response.data);
      } catch (err) {
        console.error(err);
        setError('Kunde inte hämta fakturainformationen.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoiceDetails();
  }, [id]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    setIsAddingItem(true);
    try {
      const response = await axios.post(`http://localhost:8080/api/invoices/${id}/items`, {
        title: itemTitle,
        quantity: itemQuantity,
        unitPrice: itemPrice,
      });

      setInvoice({
        ...invoice,
        items: [...invoice.items, response.data]
      });

      setItemTitle('');
      setItemQuantity(1);
      setItemPrice('');
    } catch (err) {
      console.error(err);
      alert('Det gick inte att lägga till fakturaraden.');
    } finally {
      setIsAddingItem(false);
    }
  };

  const calculateTotal = () => {
    if (!invoice?.items) return 0;
    return invoice.items.reduce((sum, item) => sum + Number(item.netAmount), 0);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Laddar fakturadetaljer...</div>;
  if (error || !invoice) return <div className="text-center py-12"><p className="text-red-500">{error}</p><Link to="/">Tillbaka</Link></div>;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 print:px-0">
      <div className="max-w-4xl mx-auto space-y-6 print:space-y-0">
        
        {/* TOPPBAR: Döljs vid utskrift */}
        <div className="flex justify-between items-center print:hidden">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors">
            &larr; Tillbaka till översikten
          </Link>
          <button 
            onClick={handlePrint}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-md font-semibold transition-colors shadow-sm cursor-pointer flex items-center gap-2"
          >
            Spara som PDF
          </button>
        </div>
        
        {/* FAKTURABLADET */}
        <div className="bg-white shadow rounded-lg p-8 print:shadow-none print:p-12 print:border-none">
          
          {/* Huvudhuvud */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
            <div>
              <div className="text-2xl font-black text-gray-900 tracking-tight mb-1 uppercase">DITT FÖRETAG AB</div>
              <p className="text-xs text-gray-400">Ekonomiavdelningen</p>
            </div>
            <div className="text-right">
              {/* STATUSBRICKAN ÄR BORTTAGEN! Kvar är bara rent fakturanummer */}
              <p className="text-sm text-gray-500 font-mono">Fakturanummer: <span className="font-bold text-gray-900">{invoice.number}</span></p>
            </div>
          </div>

          {/* Metadata / Datum och Betalningsvillkor */}
          <div className="grid grid-cols-2 gap-6 text-sm mb-6 bg-gray-50 p-4 rounded-md print:bg-transparent print:p-0 print:grid-cols-2">
            <div>
              <h3 className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Fakturadatum</h3>
              <p className="text-gray-900 font-medium mt-1">
                {new Date(invoice.dateCreated).toLocaleDateString('sv-SE')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Betalningsvillkor</h3>
              <p className="text-gray-900 font-medium mt-1">{invoice.paymentTerms}</p>
            </div>
          </div>

          {/* Sektion för Fakturarader */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4 print:text-base">Specifikation</h2>
            
            {invoice.items && invoice.items.length > 0 ? (
              <div className="border border-gray-200 rounded-md overflow-hidden mb-6 print:border-gray-300">
                <table className="min-w-full divide-y divide-gray-200 print:divide-gray-300">
                  <thead className="bg-gray-50 print:bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-gray-700">Beskrivning</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider print:text-gray-700">Antal</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider print:text-gray-700">A-pris</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider print:text-gray-700">Belopp</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 print:divide-gray-200">
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="print:break-inside-avoid">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 text-right">{item.quantity}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 text-right">{Number(item.unitPrice).toLocaleString('sv-SE')} kr</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold text-right">{Number(item.netAmount).toLocaleString('sv-SE')} kr</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 print:bg-gray-100 font-bold border-t-2 border-gray-300">
                      <td colSpan="3" className="px-6 py-4 text-right text-sm text-gray-900">Totalbelopp (exkl moms):</td>
                      <td className="px-6 py-4 text-right text-blue-600 print:text-gray-900 text-xl font-black">{calculateTotal().toLocaleString('sv-SE')} kr</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic mb-6 print:hidden">Inga rader har lagts till ännu.</p>
            )}

            {/* FORMULÄR: Döljs vid utskrift */}
            <div className="print:hidden mt-8 bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Lägg till ny rad</h3>
              <form onSubmit={handleAddItem} className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Beskrivning</label>
                  <input 
                    type="text" 
                    required
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                    placeholder="t.ex. Konsulttimmar" 
                  />
                </div>
                <div className="w-24">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Antal</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-medium text-gray-700 mb-1">A-pris (kr)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                    placeholder="0.00"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isAddingItem}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
                >
                  + Lägg till
                </button>
              </form>
            </div>

            {/* FOTNOT */}
            <div className="hidden print:block text-center text-[10px] text-gray-400 mt-12 border-t border-gray-200 pt-4">
              <p>Ditt Företag AB | Org.nr: 555555-5555 | Godkänd för F-skatt</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
} 