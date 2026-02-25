import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="bg-[#f8f9fb] text-gray-800">

      {/* ================= HERO ================= */}
      <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <header className="absolute top-0 left-0 right-0 z-20">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full border border-white/70 flex items-center justify-center">
                <span className="text-xs text-white font-semibold">ET</span>
              </div>
              <div>
                <p className="text-white font-semibold text-lg leading-tight">
                  Expense<span className="font-light">Tracker</span>
                </p>
                <p className="text-xs text-white/70 uppercase tracking-[0.2em]">
                  Online
                </p>
              </div>
            </div>

            <nav className="hidden md:flex gap-7 text-sm text-white">
              <a href="#home" className="relative group">
                <span>Home</span>
              </a>
              <a href="#about" className="hover:text-white/80 text-white/80">
                About
              </a>
              <a href="#features" className="hover:text-white/80 text-white/80">
                Features
              </a>
              <a href="#services" className="hover:text-white/80 text-white/80">
                Services
              </a>
              <a href="#blog" className="hover:text-white/80 text-white/80">
                Blog
              </a>
              <a href="#contact" className="hover:text-white/80 text-white/80">
                Contact
              </a>
            </nav>

            <Link
              to="/login"
              className="hidden md:inline-block px-4 py-1.5 rounded-full border border-white/70 text-xs text-white hover:bg-white/10 transition"
            >
              Sign In
            </Link>
          </div>
        </header>

        <div
          id="home"
          className="relative z-10 h-full flex items-center justify-center text-center px-4"
        >
          <div className="max-w-3xl mx-auto">
            <p className="text-sm uppercase tracking-[0.25em] text-white/70 mb-4">
              Smart money, simple control
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4">
              Integer accum<span className="font-extralight">san</span>
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto mb-8">
              Track your expenses, budgets, and financial goals in one clean
              dashboard. Stay in control of your money with real-time insights.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/register"
                className="px-7 py-2.5 rounded-full bg-white text-gray-900 text-sm font-medium hover:bg-gray-100 transition"
              >
                Get Started
              </Link>
              <Link
                to="/dashboard"
                className="px-7 py-2.5 rounded-full border border-white/80 text-sm text-white hover:bg-white/10 transition"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT (NO FORM) ================= */}
      <section
        id="contact"
        className="py-16 bg-white border-t border-gray-200"
      >
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-1">
              Get in touch
            </p>
            <h2 className="text-2xl font-semibold mb-2">
              We’d love to hear from you
            </h2>
            <p className="text-sm text-gray-600">
              Questions, feedback, or feature requests? Reach out to us anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 mb-10">
            {/* ✅ Contact info ONLY */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Contact Details</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our team is here to help you get the best out of your budgeting
                experience.
              </p>

              <ul className="space-y-2 text-sm text-gray-700">
                <li>📞 +91 9544 567 890</li>
                <li>📧 support@expensetracker.com</li>
                <li>📍 SmartSpend HQ, Kochi, Kerala</li>
              </ul>
            </div>
          </div>

          {/* ✅ Map */}
          <div className="rounded-2xl overflow-hidden shadow-md h-72">
            <iframe
              title="map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=76.26,9.93,76.34,10.02&layer=mapnik"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-4 text-center text-xs text-gray-500 bg-[#f7f7f9] border-t">
        © {new Date().getFullYear()} ExpenseTracker. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
