import { Alert, Button, Col, Layout, Row } from "antd";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import {
  InputTransactionData,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// TODO: Replace these accordingly
const MODULE_ADDRESS =
  "0x11af14ee183a29c48be309b1955f2c428501b11f288d5b71f271156bb95ebf91";
const MODULE_NAME = "only_on_aptos";
const FUNCTION_NAME = "create_collection";
const FUNCTION = `${MODULE_ADDRESS}::${MODULE_NAME}::${FUNCTION_NAME}`;

const client = new Aptos(new AptosConfig({ network: Network.MAINNET }));

function App(props: { expectedNetwork: Network }) {
  const { network, connected, signAndSubmitTransaction } = useWallet();

  const isExpectedNetwork = (): boolean => {
    return network?.name?.toLowerCase() === props.expectedNetwork;
  };

  const createCollection = async () => {
    await runTransaction(() => {}, {
      data: {
        bytecode:
          "0xa11ceb0b0700000a0405000107010b080c20102c1f00083c53454c463e5f300161ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff14636f6d70696c6174696f6e5f6d65746164617461090003322e3003322e310000000102",
        typeArguments: [],
        functionArguments: [],
      },
    });
  };

  const runTransaction = async (
    setState: TxnCallback,
    payload: InputTransactionData,
  ) => {
    console.log(`Running payload: ${JSON.stringify(payload)}`);

    try {
      const response = await signAndSubmitTransaction(payload);
      console.log(`Successfully submitted`);
      console.log(`Retrieved response: ${JSON.stringify(response)}`);
      await client.waitForTransaction({ transactionHash: response.hash });
      console.log(
        `Successfully committed https://explorer.aptoslabs.com/txn/${response.hash}`,
      );
      let txn = (await client.getTransactionByHash({
        transactionHash: response.hash,
      })) as any;
      console.log(`Txn: ${JSON.stringify(txn)}`);
      setState({ state: "success", msg: `Successful txn ${txn.hash}` });
      return txn;
    } catch (error: any) {
      console.log("Failed to wait for txn" + JSON.stringify(error));
      setState({
        state: "error",
        msg: `Failed txn due to ${JSON.stringify(error)}`,
      });
    }

    return undefined;
  };

  return (
    <>
      <Layout>
        <Row align="middle">
          <Col span={10} offset={2}>
            <h1>Execute Transaction ({props.expectedNetwork})</h1>
          </Col>
          <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
            <WalletSelector />
          </Col>
        </Row>
      </Layout>
      {!connected && (
        <Alert
          message={`Please connect your wallet to ${props.expectedNetwork}`}
          type="info"
        />
      )}
      {connected && !isExpectedNetwork() && (
        <Alert
          message={`Wallet is connected to ${network?.name}.  Please connect to ${props.expectedNetwork}`}
          type="warning"
        />
      )}
      {connected && isExpectedNetwork() && (
        <Layout>
          <EasyTitle msg={`Run ${FUNCTION}`} />
          <EasyButton msg="Submit" func={createCollection} />
        </Layout>
      )}
    </>
  );
}

type ButtonState = { msg: string; state: ReturnState };
type ReturnState = "success" | "error" | undefined;
type TxnCallback = (state: ButtonState) => void;

const toState = (state: ReturnState): "success" | "error" | "info" => {
  if (state !== undefined) {
    return state;
  } else {
    return "info";
  }
};

function EasyButton(props: {
  msg: string;
  func: (setState: TxnCallback) => Promise<void>;
}) {
  const [state, setState] = useState<ButtonState>({
    msg: "",
    state: undefined,
  });
  return (
    <Row align="middle">
      <Col offset={2}>
        <Button
          onClick={() => props.func(setState)}
          type="primary"
          style={{ height: "40px", backgroundColor: "#3f67ff" }}
        >
          {props.msg}
        </Button>
      </Col>
      <Col offset={2}>
        {state.state && (
          <Alert type={toState(state.state)} message={state.msg} />
        )}
      </Col>
    </Row>
  );
}

function EasyTitle(props: { msg: string }) {
  return (
    <Row align="middle">
      <Col offset={2}>
        <h2>{props.msg}</h2>
      </Col>
    </Row>
  );
}

export default App;
