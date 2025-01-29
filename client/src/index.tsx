import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { IdentityConnectWallet } from "@identity-connect/wallet-adapter-plugin";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Select } from "antd";
import { Buffer as BufferPolyFill } from "buffer";
import { Network } from "@aptos-labs/ts-sdk";
import { createBrowserHistory } from "history";

const icDappId = "2c2fc468-afb6-4b9d-98da-8067cdd03b17";

window.Buffer = BufferPolyFill;

const MAINNET_WALLETS = [
  new IdentityConnectWallet(icDappId, { networkName: Network.MAINNET }),
  new PetraWallet(),
];
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <Selector />
  </React.StrictMode>,
);

const getNetwork = (input: string | null) => {
  if (input?.toLowerCase() === "devnet") {
    return Network.DEVNET;
  } else if (input?.toLowerCase() === "testnet") {
    return Network.TESTNET;
  } else if (input?.toLowerCase() === "mainnet") {
    return Network.MAINNET;
  } else {
    return undefined;
  }
};

function Selector(this: any) {
  const [network, setNetwork] = useState<string>(
    getNetwork(new URLSearchParams(window.location.search).get("network")) ??
      Network.DEVNET,
  );
  const browserHistory = createBrowserHistory();

  return (
    <>
      <Select
        defaultValue={network}
        style={{ width: 120 }}
        onChange={(input) => {
          setNetwork(input);
          browserHistory.push(`?network=${input}`);
        }}
        options={[{ value: Network.DEVNET, label: "Devnet" }]}
      />

      {network === Network.DEVNET && (
        <AptosWalletAdapterProvider
          plugins={MAINNET_WALLETS}
          autoConnect={true}
        >
          <App expectedNetwork={network} />
        </AptosWalletAdapterProvider>
      )}
    </>
  );
}
