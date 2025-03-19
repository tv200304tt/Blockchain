import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Mine from "./pages/Mine";
import Transactions from "./pages/Transactions";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="w-full bg-blue-600 text-white py-4 shadow-md">
          <div className="max-w-4xl mx-auto flex justify-center gap-8 text-lg">
            <a href="/" className="hover:underline">🏠 Home</a>
            <a href="/mine" className="hover:underline">⛏️ Mine</a>
            <a href="/transactions" className="hover:underline">🔄 Transactions</a>
          </div>
        </nav>

        {/* Nội dung các trang */}
        <div className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mine" element={<Mine />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
