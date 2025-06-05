// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import MyNFTs from "./pages/MyNFTs/MyNFTs";
import ListNFT from "./pages/Listing/List";
import ConnectWalletPage from "./pages/ConnectWallet/ConnectWallet";
import { Nav } from "./components/Nav/Nav";
import "./App.css";
import ScrollToTop from "./components/ScrollToTop"; 

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="app-container">
      <Nav />

      <main className={`app-main ${isHome ? "home-full" : ""}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mynfts" element={<MyNFTs />} />
          <Route path="/list" element={<ListNFT />} />
          <Route path="/connect" element={<ConnectWalletPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}
