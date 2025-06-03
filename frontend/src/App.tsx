// src/App.tsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import MyNFTs from "./pages/MyNFTs";
import ListNFT from "./pages/List";
import ConnectWalletPage from "./pages/ConnectWallet";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <nav className="app-nav">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/mynfts" className="nav-link">
              My NFTs
            </Link>
            <Link to="/list" className="nav-link">
              List NFT
            </Link>
            <Link to="/connect" className="nav-link">
              Connect Wallet
            </Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mynfts" element={<MyNFTs />} />
            <Route path="/list" element={<ListNFT />} />
            <Route path="/connect" element={<ConnectWalletPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
