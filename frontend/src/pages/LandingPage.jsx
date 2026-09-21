import { SignInButton } from "@clerk/clerk-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-stone-800 font-sans selection:bg-amber-200">
      
      <header className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="font-abril text-4xl tracking-tight text-stone-900">
          NOVIORUM
        </div>
        <nav className="flex items-center gap-4">
          <SignInButton mode="modal">
            <button className="text-sm font-medium bg-stone-900 text-white px-5 py-2.5 rounded-full hover:bg-stone-700 transition-all focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:ring-offset-[#FAFAF8]">
              Login
            </button>
          </SignInButton>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-stone-900 mb-6 max-w-4xl leading-tight">
          Invoicing made safe and easy.
        </h1>
        <p className="text-lg md:text-xl text-stone-500 max-w-2xl mb-10 leading-relaxed">
          Create, manage, and download your invoices without the hassle. Noviorum provides a sleek, intuitive platform that lets you focus on what matters—running your business.
        </p>
        
        <SignInButton mode="modal">
          <button className="text-base font-medium bg-amber-700 text-white px-8 py-4 rounded-full hover:bg-amber-800 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#FAFAF8]">
            Contact us!
          </button>
        </SignInButton>
      </main>

      <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-stone-200/60">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="h-10 w-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-4">
            <span className="text-xl">✨</span>
          </div>
          <h3 className="text-lg font-semibold text-stone-900 mb-2">Aesthetic</h3>
          <p className="text-stone-500 text-sm leading-relaxed">
            No clutter so that you can focus on creating your invoices.
          </p>
        </div>
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="h-10 w-10 bg-stone-100 text-stone-700 rounded-full flex items-center justify-center mb-4">
            <span className="text-xl">⚡️</span>
          </div>
          <h3 className="text-lg font-semibold text-stone-900 mb-2">Effective</h3>
          <p className="text-stone-500 text-sm leading-relaxed">
            Create invoices in seconds, easy convertion to PDF.
          </p>
        </div>
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="h-10 w-10 bg-green-50 text-green-700 rounded-full flex items-center justify-center mb-4">
            <span className="text-xl">🔒</span>
          </div>
          <h3 className="text-lg font-semibold text-stone-900 mb-2">Safe</h3>
          <p className="text-stone-500 text-sm leading-relaxed">
            Your data is handled by modern authentication technology
          </p>
        </div>
      </section>
    </div>
  );
}