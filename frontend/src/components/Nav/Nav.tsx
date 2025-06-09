// src/components/Nav.tsx

import React from "react";
import { NavLink } from "react-router-dom";
import "./Nav.css";

export function Nav() {
  return (
    <nav className="nav-container">
      <div className="nav-list">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Home
        </NavLink>
        <NavLink to="/mynfts" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          My NFTs
        </NavLink>
        <NavLink to="/list" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          List NFT
        </NavLink>
        <NavLink to="/buy" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Buy NFT
        </NavLink>
        <NavLink to="/connect" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Connect Wallet
        </NavLink>
      </div>
    </nav>
  );
}
