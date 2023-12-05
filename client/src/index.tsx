import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BloctoWallet } from "@blocto/aptos-wallet-adapter-plugin";
import { FewchaWallet } from "fewcha-plugin-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { NightlyWallet } from "@nightlylabs/aptos-wallet-adapter-plugin";
import { OpenBlockWallet } from "@openblockhq/aptos-wallet-adapter";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { RiseWallet } from "@rise-wallet/wallet-adapter";
import { TokenPocketWallet } from "@tp-lab/aptos-wallet-adapter";
import { TrustWallet } from "@trustwallet/aptos-wallet-adapter";
import { WelldoneWallet } from "@welldone-studio/aptos-wallet-adapter";
import { IdentityConnectWallet } from "@identity-connect/wallet-adapter-plugin";
import {
  AptosWalletAdapterProvider,
  NetworkName,
} from "@aptos-labs/wallet-adapter-react";
import { Select } from "antd";
import { createBrowserHistory } from "history";
import { Network } from "aptos";
import { Buffer as BufferPolyFill } from "buffer";
import { OKXWallet } from "@okwallet/aptos-wallet-adapter";
import { MSafeWalletAdapter } from "@msafe/aptos-wallet-adapter";

const icDappId = "12346ba8-b4e1-4ddf-9c59-3b406b5b5e2a";

window.Buffer = BufferPolyFill;

const DEVNET_WALLETS = [
  new IdentityConnectWallet(icDappId, { networkName: NetworkName.Devnet }),
  new FewchaWallet(),
  new MartianWallet(),
  new MSafeWalletAdapter(),
  new NightlyWallet(),
  new OKXWallet(),
  new OpenBlockWallet(),
  new PetraWallet(),
  new PontemWallet(),
  new RiseWallet(),
  new TokenPocketWallet(),
  new TrustWallet(),
  new WelldoneWallet(),
];
const TESTNET_WALLETS = [
  new IdentityConnectWallet(icDappId, { networkName: NetworkName.Testnet }),
  // Blocto supports Testnet/Mainnet for now.
  new BloctoWallet({
    network: NetworkName.Testnet,
    bloctoAppId: "6d85f56e-5f2e-46cd-b5f2-5cf9695b4d46",
  }),
  new FewchaWallet(),
  new MartianWallet(),
  new MSafeWalletAdapter(),
  new NightlyWallet(),
  new OKXWallet(),
  new OpenBlockWallet(),
  new PetraWallet(),
  new PontemWallet(),
  new RiseWallet(),
  new TokenPocketWallet(),
  new TrustWallet(),
  new WelldoneWallet(),
];

const MAINNET_WALLETS = [
  new IdentityConnectWallet(icDappId, { networkName: NetworkName.Mainnet }),
  // Blocto supports Testnet/Mainnet for now.
  new BloctoWallet({
    network: NetworkName.Mainnet,
    bloctoAppId: "6d85f56e-5f2e-46cd-b5f2-5cf9695b4d46",
  }),
  new FewchaWallet(),
  new MartianWallet(),
  new MSafeWalletAdapter(),
  new NightlyWallet(),
  new OKXWallet(),
  new OpenBlockWallet(),
  new PetraWallet(),
  new PontemWallet(),
  new RiseWallet(),
  new TokenPocketWallet(),
  new TrustWallet(),
  new WelldoneWallet(),
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
      Network.TESTNET,
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
        options={[
          { value: Network.DEVNET, label: "Devnet" },
          { value: Network.TESTNET, label: "Testnet" },
          { value: Network.MAINNET, label: "Mainnet" },
        ]}
      />

      {network === Network.DEVNET && (
        <AptosWalletAdapterProvider plugins={DEVNET_WALLETS} autoConnect={true}>
          <App expectedNetwork={network} />
        </AptosWalletAdapterProvider>
      )}
      {network === Network.TESTNET && (
        <AptosWalletAdapterProvider
          plugins={TESTNET_WALLETS}
          autoConnect={true}
        >
          <App expectedNetwork={network} />
        </AptosWalletAdapterProvider>
      )}
      {network === Network.MAINNET && (
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
