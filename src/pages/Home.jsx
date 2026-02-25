// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Wallet,
  Shield,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Home = () => {
  return (
    <div className="w-full overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <section
        className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1601597111158-2fceff292cdc)",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 text-center text-white px-6 w-full">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Smart Finance with{" "}
            <span className="text-green-400">Expense Tracker AI</span>
          </h1>

          <p className="text-lg mb-8 text-gray-200 max-w-3xl mx-auto">
            Track your expenses, analyze spending, set smart goals & take full
            control of your money with AI-powered insights.
          </p>

          <div className="flex justify-center gap-6">
            <Link
              to="/login"
              className="bg-green-500 px-8 py-3 rounded-full text-white font-semibold hover:bg-green-600 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-500 px-8 py-3 rounded-full text-white font-semibold hover:bg-blue-600 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-20 bg-white w-full px-10">
        <div className="grid md:grid-cols-2 gap-14 items-center w-full">
          <img
            src="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad"
            className="rounded-2xl shadow-lg w-full"
            alt="ATM"
          />

          <div>
            <h2 className="text-4xl font-bold mb-5">Why Choose Us?</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Our AI-powered Expense Tracker helps you manage income,
              expenses, budgets, goals & financial security all in one place.
            </p>

            <ul className="space-y-3 text-gray-700 text-lg">
              <li>✅ AI-powered insights</li>
              <li>✅ Smart budget management</li>
              <li>✅ Goal & savings tracking</li>
              <li>✅ Bank-grade security</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="py-20 bg-gray-50 w-full px-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3">Our Services</h2>
          <p className="text-gray-600 text-lg">
            Everything you need to manage your money efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <ServiceCard
            icon={<Wallet />}
            title="Expense Tracking"
            text="Track your daily spending automatically"
          />
          <ServiceCard
            icon={<BarChart3 />}
            title="Smart Reports"
            text="Visual reports for better financial planning"
          />
          <ServiceCard
            icon={<Shield />}
            title="Secure Data"
            text="Industry-grade encryption for your transactions"
          />
          <ServiceCard
            icon={<TrendingUp />}
            title="AI Insights"
            text="Personalized financial predictions"
          />
          <ServiceCard
            icon={<Wallet />}
            title="Budget Planning"
            text="Organize spending by monthly budgets"
          />
          <ServiceCard
            icon={<Shield />}
            title="Goal Tracking"
            text="Save for long-term financial freedom"
          />
        </div>
      </section>

    

      {/* ================= CONTACT (NO FORM, NO MAP) ================= */}
      <section className="py-20 bg-gray-900 text-white w-full px-10">
        <div className="max-w-3xl mx-auto text-center">

          <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>

          <div className="space-y-4 text-gray-300 text-lg">
            <p className="flex justify-center items-center gap-3">
              <Phone /> +91 98765 43210
            </p>
            <p className="flex justify-center items-center gap-3">
              <Mail /> support@expensetracker.ai
            </p>
            <p className="flex justify-center items-center gap-3">
              <MapPin /> India
            </p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-black text-gray-400 text-center py-5 w-full">
        © 2025 Expense Tracker AI. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;

/* ================= SUB COMPONENTS ================= */

const ServiceCard = ({ icon, title, text }) => (
  <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition text-center">
    <div className="text-blue-600 mb-4 flex justify-center text-3xl">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{text}</p>
  </div>
);

const BlogCard = ({ title }) => (
  <div className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-xl transition">
    <img
      src="https://source.unsplash.com/600x350/?finance"
      alt="blog"
      className="rounded mb-4 w-full"
    />
    <h3 className="font-semibold text-lg">{title}</h3>
    <p className="text-sm text-gray-600 mt-2">
      Learn how to improve your financial health with expert tips.
    </p>
  </div>
);
