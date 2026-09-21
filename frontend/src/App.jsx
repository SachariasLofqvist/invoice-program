import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";
import Dashboard from "./pages/Dashboard";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceDetail from "./pages/InvoiceDetail";
import LandingPage from "./pages/LandingPage";


export default function App() {
  return (
    <>
      <SignedIn>
        <BrowserRouter>
          <div className="fixed top-4 right-4 z-50 print:hidden">
            <UserButton />
          </div>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<InvoiceForm />} />
            <Route path="/invoice/:id" element={<InvoiceDetail />} />
          </Routes>
        </BrowserRouter>
      </SignedIn>

      <SignedOut>
        <LandingPage/>
      </SignedOut>
    </>
  );
}
