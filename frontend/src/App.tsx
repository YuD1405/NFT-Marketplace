import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import MyNFTs from "./pages/MyNFTs";
import ListNFT from "./pages/List";
import ConnectWalletPage from "./pages/ConnectWallet";

export default function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
        <Link to="/mynfts" style={{ marginRight: "1rem" }}>My NFTs</Link>
        <Link to="/list"style={{ marginRight: "1rem" }}>List NFT</Link>
        <Link to="/connect" style={{ marginRight: "1rem" }}>Connect Wallet</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mynfts" element={<MyNFTs />} />
        <Route path="/list" element={<ListNFT />} />
        <Route path="/connect" element={<ConnectWalletPage />} />
      </Routes>
    </Router>
  );
}