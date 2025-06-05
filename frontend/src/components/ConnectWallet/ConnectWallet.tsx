import React from "react";
import { useWallet } from "../../hooks/useWallet";
import { shortenAddress } from "../../utils/shortAddress";

export default function ConnectWallet() {
  const { account, connect } = useWallet();

  return (
    <button onClick={connect}>
      {account
        ? `Connected: ${shortenAddress(account)}`
        : "Connect Wallet"}
    </button>
  );
}
