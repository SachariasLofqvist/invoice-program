import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";
import Dashboard from "./pages/Dashboard";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceDetail from "./pages/InvoiceDetail";

export default function App() {
  return (
    <>
      <SignedIn>
        <BrowserRouter>
          <div className="fixed top-4 right-4 z-9999">
            <UserButton/>
          </div>
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<InvoiceForm />} />
            <Route path="/invoice/:id" element={<InvoiceDetail />} />
          </Routes>
        </BrowserRouter>
      </SignedIn>


      <SignedOut>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Invoice app</h1>
            <SignIn />
          </div>
        </div>
      </SignedOut>
    </>
  );
}