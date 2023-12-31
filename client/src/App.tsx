import { Alert, Button, Col, Layout, Row } from "antd";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import {
  InputTransactionData,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import {
  Aptos,
  AptosConfig,
  EntryFunctionArgumentTypes,
  Network,
  SimpleEntryFunctionArgumentTypes,
  TypeTag,
} from "@aptos-labs/ts-sdk";

// TODO: Load URL from wallet
export const DEVNET_CLIENT = new Aptos(
  new AptosConfig({ network: Network.DEVNET }),
);
export const TESTNET_CLIENT = new Aptos(
  new AptosConfig({ network: Network.TESTNET }),
);
export const MAINNET_CLIENT = new Aptos(
  new AptosConfig({ network: Network.MAINNET }),
);

// TODO: make this more accessible / be deployed by others?
export const DEV_MODULE_ADDRESS =
  "0x2b8ce856ae7536f41cddd1f7be1d9b69a46aa79a65e5b35f7f55732989751498";
export const MAINNET_MODULE_ADDRESS =
  "0x6de37368e31dff4580b211295198159ee6f98b42ffa93c5683bb955ca1be67e0";
export const DEVNET_OBJECT_ADDRESS =
  "0xc261491e35296ffbb760715c2bb83b87ced70029e82e100ff53648b2f9e1a598";
export const TESTNET_OBJECT_ADDRESS =
  "0x3eafcd35de233463ea4d8653638c323211865163853f2f866705670b291d3370";
export const MAINNET_OBJECT_ADDRESS =
  "0x64c3093330189cdf176c1fbde0fc4957534741a7949cc6d3c2ba6a2ad9088ab9";

function App(props: { expectedNetwork: Network }) {
  const {
    network,
    connected,
    signAndSubmitTransaction,
    account,
    wallet,
    isLoading,
  } = useWallet();

  const moduleAddress = (): string => {
    if (isDevnet() || isTestnet()) {
      return DEV_MODULE_ADDRESS;
    } else {
      return MAINNET_MODULE_ADDRESS;
    }
  };
  const isExpectedNetwork = (): boolean => {
    return network?.name?.toLowerCase() === props.expectedNetwork;
  };
  const isDevnet = (): boolean => {
    // There's a very specific override here for Martian
    return (
      (network?.name as string)?.toLowerCase() === "devnet" ||
      (wallet?.name === "Martian" && network?.name.toLowerCase() === "custom")
    );
  };

  const isTestnet = (): boolean => {
    // There's a very specific override here for Martian
    return (network?.name as string)?.toLowerCase() === "testnet";
  };

  const objectAddress = (): string => {
    if (isDevnet()) {
      return DEVNET_OBJECT_ADDRESS;
    } else if (isTestnet()) {
      return TESTNET_OBJECT_ADDRESS;
    } else {
      return MAINNET_OBJECT_ADDRESS;
    }
  };

  const fundAccount = async (setState: TxnCallback) => {
    if (!account) {
      setState({ state: "error", msg: `Wallet not connected` });
      return;
    }
    try {
      if (isDevnet()) {
        await DEVNET_CLIENT.fundAccount({
          accountAddress: account.address,
          amount: 100000000,
        });
        setState({ state: "success", msg: `Wallet funded` });
      } else if (isTestnet()) {
        await TESTNET_CLIENT.fundAccount({
          accountAddress: account.address,
          amount: 100000000,
        });
        setState({ state: "success", msg: `Wallet funded` });
      } else {
        console.log("Only devnet and testnet are supported");
        setState({ state: "error", msg: `Wallet not connected` });
      }
    } catch (e: any) {
      setState({
        state: "error",
        msg: `Failed to fund account ${JSON.stringify(e)}`,
      });
    }
  };

  const runSingleSignerFunction = async (
    setState: TxnCallback,
    moduleName: string,
    functionName: string,
    functionArguments?: (
      | SimpleEntryFunctionArgumentTypes
      | EntryFunctionArgumentTypes
    )[],
    typeArgs?: (string | TypeTag)[],
  ) => {
    await runTransaction(setState, {
      data: {
        function: `${moduleAddress()}::${moduleName}::${functionName}`,
        typeArguments: typeArgs ?? [],
        functionArguments: functionArguments ?? [],
      },
    });
  };
  const testObject = async (setState: TxnCallback) => {
    const object_address = objectAddress();

    await runSingleSignerFunction(
      setState,
      "wallet_tester",
      "test_object",
      [object_address],
      ["0x1::object::ObjectCore"],
    );
  };

  const testVectorObject = async (setState: TxnCallback) => {
    const object_address = objectAddress();
    await runSingleSignerFunction(
      setState,
      "wallet_tester",
      "test_vector_object",
      [object_address, object_address],
      ["0x1::object::ObjectCore"],
    );
  };

  const testObjectFixed = async (setState: TxnCallback) => {
    const object_address = objectAddress();

    await runSingleSignerFunction(
      setState,
      "wallet_tester",
      "test_vector_object_fixed_correct",
      [object_address],
    );
  };

  const testVectorObjectFixed = async (setState: TxnCallback) => {
    const object_address = objectAddress();

    await runSingleSignerFunction(
      setState,
      "wallet_tester",
      "test_vector_object_fixed",
      [[object_address, object_address]],
    );
  };

  const testOptionSome = async (setState: TxnCallback) => {
    await runSingleSignerFunction(setState, "wallet_tester", "test_option", [
      12345,
      false,
    ]);
  };

  const testOptionNone = async (setState: TxnCallback) => {
    await runSingleSignerFunction(setState, "wallet_tester", "test_option", [
      undefined,
      true,
    ]);
  };

  const testOptionStringSome = async (setState: TxnCallback) => {
    await runSingleSignerFunction(
      setState,
      "wallet_tester",
      "test_option_string",
      ["", false],
    );
  };

  const testOptionStringNone = async (setState: TxnCallback) => {
    await runSingleSignerFunction(
      setState,
      "wallet_tester",
      "test_vector_string",
      [undefined, true],
    );
  };

  const testVectorOptionSome = async (setState: TxnCallback) => {
    await runSingleSignerFunction(
      setState,
      "wallet_tester",
      "test_vector_option",
      [[12345, 54], false],
    );
  };

  const testVectorOptionNone = async (setState: TxnCallback) => {
    await runSingleSignerFunction(
      setState,
      "wallet_tester",
      "test_vector_option",
      [undefined, true],
    );
  };

  const testError = async (setState: TxnCallback) => {
    await runSingleSignerFunction(setState, "wallet_tester", "test_error");
  };

  const createObject = async (setState: TxnCallback) => {
    await runSingleSignerFunction(setState, "wallet_tester", "init_object");
  };

  const testBool = async (setState: TxnCallback) => {
    await runSingleSignerFunction(setState, "wallet_tester", "test_bool", [
      true,
    ]);
  };

  const testAddress = async (setState: TxnCallback) => {
    await runSingleSignerFunction(setState, "wallet_tester", "test_address", [
      "0x1",
    ]);
  };

  const testString = async (setState: TxnCallback) => {
    await runSingleSignerFunction(setState, "wallet_tester", "test_string", [
      "hello world!",
    ]);
  };
  const testU8 = async (setState: TxnCallback) => {
    await runSingleSignerFunction(setState, "wallet_tester", "test_u8", [255]);
  };

  const testU16 = async (setState: TxnCallback) => {
    await runSingleSignerFunction(setState, "wallet_tester", "test_u16", [
      65535,
    ]);
  };

  const testU32 = async (setState: TxnCallback) => {
    await runSingleSignerFunction(setState, "wallet_tester", "test_u32", [
      4294967295,
    ]);
  };

  const testU64 = async (setState: TxnCallback) => {
    await runSingleSignerFunction(setState, "wallet_tester", "test_u64", [
      "18446744073709551615",
    ]);
  };

  const testU128 = async (setState: TxnCallback) => {
    await runSingleSignerFunction(setState, "wallet_tester", "test_u128", [
      "340282366920938463463374607431768211455",
    ]);
  };

  const testU256 = async (setState: TxnCallback) => {
    await runSingleSignerFunction(setState, "wallet_tester", "test_u256", [
      "115792089237316195423570985008687907853269984665640564039457584007913129639935",
    ]);
  };

  const runTransaction = async (
    setState: TxnCallback,
    payload: InputTransactionData,
  ) => {
    console.log(`Running payload: ${JSON.stringify(payload)}`);
    let client: Aptos;
    if (isDevnet()) {
      client = DEVNET_CLIENT;
    } else if (isTestnet()) {
      client = TESTNET_CLIENT;
    } else {
      client = MAINNET_CLIENT;
    }

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
            <h1>
              Wallet tester ({props.expectedNetwork}){" "}
              <a href="https://github.com/gregnazario/aptos-wallet-tester">
                Source Code
              </a>
            </h1>
          </Col>
          <Col span={12} style={{ textAlign: "right", paddingRight: "200px" }}>
            <WalletSelector />
          </Col>
        </Row>
        <Row>
          <Col offset={2}>
            <ul>
              <li>
                <img
                  width={50}
                  src={wallet?.icon}
                  alt={`${wallet?.name}'s Icon`}
                />
                {wallet?.name}
              </li>
              <li>Network name: "{network?.name}"</li>
              <li>Network URL: "{network?.url}"</li>
              <li>Network Chain ID: "{network?.chainId}"</li>
              <li>Address: "{account?.address}"</li>
              <li>ANS Name: "{account?.ansName}"</li>
              <li>Public Key: "{account?.publicKey}"</li>
              <li>Keys required: "{account?.minKeysRequired}"</li>
              <li>Is loading: {JSON.stringify(isLoading)}</li>
            </ul>
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
          {(isDevnet() || isTestnet()) && (
            <>
              <EasyTitle msg="Faucet" />
              <EasyButton msg="Get Funds" func={fundAccount} />
            </>
          )}

          <EasyTitle msg="Basic inputs, these should not fail with an error either in the wallet or here" />
          <EasyButton msg="Test boolean" func={testBool} />
          <EasyButton msg="Test address" func={testAddress} />
          <EasyButton msg="Test string" func={testString} />

          <EasyTitle msg="Numbers, these should not fail with an error either in the wallet or here" />
          <EasyButton msg="Test u8" func={testU8} />
          <EasyButton msg="Test u16" func={testU16} />
          <EasyButton msg="Test u32" func={testU32} />
          <EasyButton msg="Test u64" func={testU64} />
          <EasyButton msg="Test u128" func={testU128} />
          <EasyButton msg="Test u256" func={testU256} />

          <EasyTitle msg="Objects, these should not fail with an error either in the wallet or here" />
          {(isDevnet() || isTestnet()) && (
            <EasyButton msg="Create object" func={createObject} />
          )}
          <EasyButton msg="Test object (Object<T>)" func={testObject} />
          <EasyButton
            msg="Test vector object (vector<Object<T>>)"
            func={testVectorObject}
          />
          <EasyButton
            msg="Test object Fixed(Object<TestStruct>)"
            func={testObjectFixed}
          />
          <EasyButton
            msg="Test vector object Fixed(vector<Object<TestStruct>>)"
            func={testVectorObjectFixed}
          />

          <EasyTitle msg="Options, these should not fail with an error either in the wallet or here" />
          <EasyButton
            msg="Test option Some (Option<u64>(some))"
            func={testOptionSome}
          />
          <EasyButton
            msg="Test option None (Option<u64>(none))"
            func={testOptionNone}
          />
          <EasyButton
            msg="Test option empty string (Option<string>(some))"
            func={testOptionStringSome}
          />
          <EasyButton
            msg="Test option string none (Option<string>(none))"
            func={testOptionStringNone}
          />
          <EasyButton
            msg="Test vector option Some (Vector<Option<u64>>(some))"
            func={testVectorOptionSome}
          />
          <EasyButton
            msg="Test vector option None (Vector<Option<u64>>(none))"
            func={testVectorOptionNone}
          />

          <EasyTitle msg="Errors this should always fail, your wallet might want to prevent people from submitting it or at least show that it will fail" />
          <EasyButton msg="Test error" func={testError} />
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
