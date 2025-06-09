// src/pages/Home.tsx

import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-fade-bottom" />
        
        <div className="hero-content">
          <h1 className="hero-title">ElementaVerse</h1>
          <p className="hero-subtitle">
            Mint, Trade & Showcase Your Epic Game-Style NFTs
          </p>
          <Link to="/connect" className="hero-button">
            Connect Wallet
          </Link>
        </div>
      </section>

      {/* ===== About Us Section ===== */}
      <section className="story-section">
        <div className="section-header">
          <h2 className="section-title">ABOUT US</h2>
        </div>
        <div className="story-content">
          <div className="story-text">
            <p>
              Enter ElementaVerse—where you collect and trade on-chain elemental weapons. Fire, Ice, Thunder, Nature, Darkness—all await.
            </p>
            <p>
              Connect your wallet and begin forging your legendary loadout.
            </p>
          </div>
          <div className="story-image">
            <img
              src="https://yud1405.github.io/NFT_marketplace_Img/intro.png"
              alt="About Us Illustration"
            />
          </div>
        </div>

        {/* Divider giữa About Us và Mint NFTs */}
        <div className="section-divider" />
      </section>

      {/* ===== Mint NFTs Section ===== */}
      <section className="Mint-section">
        <div className="section-header">
          <h2 className="section-title">MINT NFTs</h2>
        </div>
        <div className="Mint-content">
          <div className="Mint-image">
            <img
              src="https://yud1405.github.io/NFT_marketplace_Img/feature_mint.png"
              alt="Mint NFTs"
            />
          </div>
          <div className="Mint-text">
            <p>
              Forge your own legendary weapons straight from the blockchain! Head to the Mint page to create on-chain elemental gear—flaming swords, thunder hammers, venomous daggers, and more.
            </p>
            <Link to="/mynfts" className="feature-button">
              Build your NFT
            </Link>
          </div>
        </div>

        {/* Divider giữa Mint NFTs và My Collection */}
        <div className="section-divider" />
      </section>

      {/* ===== My Collection Section ===== */}
      <section className="Collection-section">
        <div className="section-header">
          <h2 className="section-title">MY LISTINGS</h2>
        </div>
        <div className="Collection-content">
          <div className="Collection-text">
            <p>
              Showcase your NFTs currently listed for sale. Manage, track, and update your prices to maximize your selling potential.
            </p>

            <Link to="/list" className="feature-button">
              List a New NFT
            </Link>
          </div>
          <div className="Collection-image">
            <img
              src="https://yud1405.github.io/NFT_marketplace_Img/feature_collection.png"
              alt="My Listings"
            />
          </div>
        </div>

        {/* Divider between My Listings and other sections */}
        <div className="section-divider" />
      </section>


      {/* ===== Marketplace Section ===== */}
      <section className="Marketplace-section">
        <div className="section-header">
          <h2 className="section-title">MARKETPLACE</h2>
        </div>
        <div className="Marketplace-content">
          <div className="Marketplace-image">
            <img
              src="https://yud1405.github.io/NFT_marketplace_Img/feature_marketplace.png"
              alt="Marketplace"
            />
          </div>
          <div className="Marketplace-text">
            <p>
              Trade with other adventurers in real-time. List, buy, and sell elemental NFT weapons with low fees and instant transactions. Browse hundreds of listings—fire blades, frost spears, thunder bows, and more—all waiting for a new wielder.
            </p>
            <Link to="/buy" className="feature-button">
              Go to Marketplace
            </Link>
          </div>
        </div>

        {/* (Nếu đây là section cuối, bạn có thể để hoặc bỏ dòng dưới) */}
        <div className="section-divider" />
      </section>
    </div>
  );
}
