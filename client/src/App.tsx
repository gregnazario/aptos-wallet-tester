import { Alert, Button, Checkbox, Col, Input, Layout, Row } from "antd";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import {
  InputTransactionData,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import {
  AccountAddress,
  AccountAddressInput,
  Aptos,
  AptosConfig,
  EntryFunctionArgumentTypes,
  Network,
  SimpleEntryFunctionArgumentTypes,
  TypeTag,
} from "@aptos-labs/ts-sdk";

// TODO: Replace these accordingly
const MODULE_ADDRESS =
  "0x11af14ee183a29c48be309b1955f2c428501b11f288d5b71f271156bb95ebf91";
const MODULE_NAME = "only_on_aptos";
const FUNCTION_NAME = "create_collection";
const FUNCTION = `${MODULE_ADDRESS}::${MODULE_NAME}::${FUNCTION_NAME}`;

const client = new Aptos(new AptosConfig({ network: Network.MAINNET }));

function App(props: { expectedNetwork: Network }) {
  const { network, connected, signAndSubmitTransaction } = useWallet();

  let [collectionName, setCollectionName] = useState<string | undefined>();
  let [collectionDescription, setCollectionDescription] = useState<
    string | undefined
  >();
  let [collectionUri, setCollectionUri] = useState<string | undefined>();
  let [tokenNamePrefix, setTokenNamePrefix] = useState<string | undefined>();
  let [tokenDesc, setTokenDesc] = useState<string | undefined>();
  let [tokenUris, setTokenUris] = useState<string[]>([]);
  let [tokenUriWeights, setTokenUriWeights] = useState<number[]>([]);
  let [mutableCollectionMetadata, setMutableCollectionMetadata] =
    useState<boolean>(false);
  let [mutableTokenMetadata, setMutableTokenMetadata] =
    useState<boolean>(false);
  let [tokensBurnable, setTokensBurnable] = useState<boolean>(false);
  let [tokensTransferrable, setTokensTransferrable] = useState<boolean>(false);
  let [maxSupply, setMaxSupply] = useState<number | undefined>();
  let [royaltyNumerator, setRoyaltyNumerator] = useState<number | undefined>();
  let [royaltyDenominator, setRoyaltyDenominator] = useState<
    number | undefined
  >();

  const isExpectedNetwork = (): boolean => {
    return network?.name?.toLowerCase() === props.expectedNetwork;
  };

  const onStringChange = async (
    event: any,
    setter: (
      value:
        | ((prevState: string | undefined) => string | undefined)
        | string
        | undefined,
    ) => void,
  ) => {
    const val = event.target.value as string;
    setter(val);
  };
  const onStringsChange = async (
    event: any,
    setter: (value: ((prevState: string[]) => string[]) | string[]) => void,
  ) => {
    const val = event.target.value as string;
    const parts = val.split(",");
    const strings = parts.map((inner) => {
      const trimmed = inner.trim();
      return trimmed;
    });
    setter(strings);
  };

  const onBoolChange = async (
    event: any,
    setter: (value: ((prevState: boolean) => boolean) | boolean) => void,
  ) => {
    const val = event.target.checked;
    setter(val);
  };

  const onNumberChange = async (
    event: any,
    setter: (
      value:
        | ((prevState: number | undefined) => number | undefined)
        | number
        | undefined,
    ) => void,
  ) => {
    const val = event.target.value;
    setter(Number(val));
  };

  const onNumbersChange = async (
    event: any,
    setter: (value: ((prevState: number[]) => number[]) | number[]) => void,
  ) => {
    const val = event.target.value as string;
    const parts = val.split(",");
    const nums = parts.map((inner) => {
      const trimmed = inner.trim();
      return Number(trimmed);
    });
    setter(nums);
  };

  const createCollection = async () => {
    //   public entry fun create_collection(
    //         admin: &signer,
    //         collection_name: String,
    //         collection_description: String,
    //         collection_uri: String,
    //         token_name_prefix: String,
    //         token_description: String,
    //         token_uris: vector<String>,
    //         token_uris_weights: vector<u64>,
    //         mutable_collection_metadata: bool, // including description, uri, royalty, to make admin life easier
    //         mutable_token_metadata: bool, // including description, name, properties, uri, to make admin life easier
    //         tokens_burnable_by_collection_owner: bool,
    //         tokens_transferrable_by_collection_owner: bool,
    //         max_supply: Option<u64>,
    //         royalty_numerator: Option<u64>,
    //         royalty_denominator: Option<u64>,
    const args = [
      collectionName,
      collectionDescription,
      collectionUri,
      tokenNamePrefix,
      tokenDesc,
      tokenUris,
      tokenUriWeights,
      mutableCollectionMetadata,
      mutableTokenMetadata,
      tokensBurnable,
      tokensTransferrable,
      maxSupply,
      royaltyNumerator,
      royaltyDenominator,
    ];

    console.log(`INPUTS: ${JSON.stringify(args)}`);
    runSingleSignerFunction(
      (_) => {},
      MODULE_ADDRESS,
      MODULE_NAME,
      FUNCTION_NAME,
      args,
      [],
    );
  };

  const runSingleSignerFunction = async (
    setState: TxnCallback,
    moduleAddress: AccountAddressInput,
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
        function: `${AccountAddress.from(moduleAddress).toString()}::${moduleName}::${functionName}`,
        typeArguments: typeArgs ?? [],
        functionArguments: functionArguments ?? [],
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
          <Row>
            <Col>Note that there is trimming on inputs</Col>
          </Row>
          <Row>
            <Col>Collection Name (string)</Col>
            <Col>
              <Input
                placeholder={"Collection Name"}
                onChange={(event) => onStringChange(event, setCollectionName)}
              />
            </Col>
          </Row>
          <Row>
            <Col>Collection Description (string)</Col>
            <Col>
              <Input
                placeholder={"Collection Description"}
                onChange={(event) =>
                  onStringChange(event, setCollectionDescription)
                }
              />
            </Col>
          </Row>
          <Row>
            <Col>Collection Uri (string)</Col>
            <Col>
              <Input
                placeholder={"Collection Uri"}
                onChange={(event) => onStringChange(event, setCollectionUri)}
              />
            </Col>
          </Row>
          <Row>
            <Col>Token Name Prefix (string)</Col>
            <Col>
              <Input
                placeholder={"Token name prefix"}
                onChange={(event) => onStringChange(event, setTokenNamePrefix)}
              />
            </Col>
          </Row>
          <Row>
            <Col>Token Description (string)</Col>
            <Col>
              <Input
                placeholder={"Token Description"}
                onChange={(event) => onStringChange(event, setTokenDesc)}
              />
            </Col>
          </Row>
          <Row>
            <Col>Token Uris (comma separated string list)</Col>
            <Col>
              <Input
                placeholder={"Token Uris"}
                onChange={(event) => onStringsChange(event, setTokenUris)}
              />
            </Col>
          </Row>
          <Row>
            <Col>Token Uri Weights (comma separated number list)</Col>
            <Col>
              <Input
                placeholder={"Token Uri weights"}
                onChange={(event) => onNumbersChange(event, setTokenUriWeights)}
              />
            </Col>
          </Row>
          <Row>
            <Col>Mutable Collection Metadata (Check for true)</Col>
            <Col>
              <Checkbox
                onChange={(event) =>
                  onBoolChange(event, setMutableCollectionMetadata)
                }
              />
            </Col>
          </Row>
          <Row>
            <Col>Mutable Token Metadata (Check for true)</Col>
            <Col>
              <Checkbox
                onChange={(event) =>
                  onBoolChange(event, setMutableTokenMetadata)
                }
              />
            </Col>
          </Row>
          <Row>
            <Col>Tokens Burnable (Check for true)</Col>
            <Col>
              <Checkbox
                onChange={(event) => onBoolChange(event, setTokensBurnable)}
              />
            </Col>
          </Row>
          <Row>
            <Col>Tokens Transferrable (Check for true)</Col>
            <Col>
              <Checkbox
                onChange={(event) =>
                  onBoolChange(event, setTokensTransferrable)
                }
              />
            </Col>
          </Row>
          <Row>
            <Col>Max Supply (number, put n/a for none option)</Col>
            <Col>
              <Input
                placeholder={"Max supply"}
                onChange={(event) => onNumberChange(event, setMaxSupply)}
              />
            </Col>
          </Row>
          <Row>
            <Col>Royalty Numerator (number, put n/a for none option)</Col>
            <Col>
              <Input
                placeholder={"Royalty Numerator"}
                onChange={(event) => onNumberChange(event, setRoyaltyNumerator)}
              />
            </Col>
          </Row>
          <Row>
            <Col>Royalty Denominator (number, put n/a for none option)</Col>
            <Col>
              <Input
                placeholder={"Royalty Denominator"}
                onChange={(event) =>
                  onNumberChange(event, setRoyaltyDenominator)
                }
              />
            </Col>
          </Row>
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
