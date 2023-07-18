import {Alert, Button, Col, Layout, Row} from "antd";
import {WalletSelector} from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import {Network, Provider, Types} from "aptos";
import {useWallet} from "@aptos-labs/wallet-adapter-react";
import {useState} from "react";

// TODO: Load URL from wallet
export const CLIENT = new Provider(Network.DEVNET);

// TODO: make this more accessible / be deployed by others?
export const MODULE_ADDRESS = "0xb11affd5c514bb969e988710ef57813d9556cc1e3fe6dc9aa6a82b56aee53d98";
export const OBJECT_ADDRESS = "0x67e586973b2ccda1491aa274fc40c89cef5ae4e44aeb4746977b932867788ada";


function App(this: any) {
    const {network, connected, signAndSubmitTransaction, account, wallet, isLoading} = useWallet();

    const isDevnet = (): boolean => {
        // There's a very specific override here for Martian
        return (network?.name as string).toLowerCase() === 'devnet' || (wallet?.name === "Martian" && network?.name.toLowerCase() === "custom");
    }

    const testObject = async (setState: TxnCallback) => {
        await runTransaction(
            setState,
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_object`,
                type_arguments: ["0x1::object::ObjectCore"],
                arguments: [
                    OBJECT_ADDRESS,
                ],
            })
    }

    const testVectorObject = async (setState: TxnCallback) => {
        await runTransaction(
            setState,
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_vector_object`,
                type_arguments: ["0x1::object::ObjectCore"],
                arguments: [
                    [OBJECT_ADDRESS, OBJECT_ADDRESS],
                ],
            })
    }

    const testOptionSome = async (setState: TxnCallback) => {
        await runTransaction(
            setState,
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_vector_option`,
                type_arguments: [],
                arguments: [
                    "12345",
                ],
            })

    }

    const testOptionNone = async (setState: TxnCallback) => {
        await runTransaction(
            setState,
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_vector_option`,
                type_arguments: [],
                arguments: [
                    undefined,
                ],
            })
    }

    const testOptionVectorSome = async (setState: TxnCallback) => {
        await runTransaction(
            setState,
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_option_vector`,
                type_arguments: [],
                arguments: [
                    ["12345", "54"],
                ],
            })
    }
    const testOptionVectorNone = async (setState: TxnCallback) => {
        await runTransaction(
            setState,
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_vector_option`,
                type_arguments: [],
                arguments: [
                    undefined, "12345"
                ],
            })
    }

    const testError = async (setState: TxnCallback) => {
        await runTransaction(
            setState,
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_error`,
                type_arguments: [],
                arguments: [],
            })
    }

    const testU8 = async (setState: TxnCallback) => {
        await runTransaction(
            setState,
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_u8`,
                type_arguments: [],
                arguments: [
                    255
                ],
            })
    }

    const testU16 = async (setState: TxnCallback) => {
        await runTransaction(
            setState,
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_u16`,
                type_arguments: [],
                arguments: [
                    65535
                ],
            })
    }

    const testU32 = async (setState: TxnCallback) => {
        await runTransaction(
            setState,
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_u32`,
                type_arguments: [],
                arguments: [
                    4294967295

                ],
            })
    }

    const testU64 = async (setState: TxnCallback) => {
        await runTransaction(
            setState,
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_u64`,
                type_arguments: [],
                arguments: [
                    "18446744073709551615"
                ],
            })
    }

    const testU128 = async (setState: TxnCallback) => {
        await runTransaction(
            setState,
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_u128`,
                type_arguments: [],
                arguments: [
                    "340282366920938463463374607431768211455"
                ],
            })
    }

    const testU256 = async (setState: TxnCallback) => {
        await runTransaction(
            setState,
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_u256`,
                type_arguments: [],
                arguments: [
                    "115792089237316195423570985008687907853269984665640564039457584007913129639935"
                ],
            })
    }

    const runTransaction = async <T extends Types.TransactionPayload>(setState: TxnCallback, payload: T) => {
        console.log(`Running payload: ${JSON.stringify(payload)}`);
        try {
            const response = await signAndSubmitTransaction(payload);
            console.log(`Successfully submitted`);
            await CLIENT.waitForTransaction(response.hash);
            console.log(`Successfully committed`);
            let txn = await CLIENT.getTransactionByHash(response.hash) as any;
            console.log(`Txn: ${JSON.stringify(txn)}`);
            setState({state: "success", msg: `Successful txn ${txn.hash}`})
            return txn;
        } catch (error: any) {
            console.log("Failed to wait for txn" + error)
            setState({state: "error", msg: `Failed txn due to ${JSON.stringify(error)}`})
        }

        return undefined;
    }

    return (
        <>
            <Layout>
                <Row align="middle">
                    <Col span={10} offset={2}>
                        <h1>Wallet tester ({network?.name})</h1>
                    </Col>
                    <Col span={12} style={{textAlign: "right", paddingRight: "200px"}}>
                        <WalletSelector/>
                    </Col>
                </Row>
                <Row>
                    <Col offset={2}>
                        <ul>
                            <li>
                                <img width={50} src={wallet?.icon} alt={`${wallet?.name}'s Icon`}/>
                                {wallet?.name}
                            </li>
                            <li>
                                Network name: "{network?.name}"
                            </li>
                            <li>
                                Network URL: "{network?.url}"
                            </li>
                            <li>
                                Network Chain ID: "{network?.chainId}"
                            </li>
                            <li>
                                Address: "{account?.address}"
                            </li>
                            <li>
                                ANS Name: "{account?.ansName}"
                            </li>
                            <li>
                                Public Key: "{account?.publicKey}"
                            </li>
                            <li>
                                Keys required: "{account?.minKeysRequired}"
                            </li>
                            <li>
                                Is loading: {JSON.stringify(isLoading)}
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Layout>
            {
                !connected &&
                <Alert message={`Please connect your wallet`} type="info"/>
            }
            {
                connected && !isDevnet() &&
                <Alert message={`Wallet is connected to ${network?.name}.  Please connect to devnet`} type="warning"/>
            }
            {connected && isDevnet() &&
                <Layout>
                    <EasyTitle msg="Numbers"/>
                    <EasyButton msg="Test u8" func={testU8}/>
                    <EasyButton msg="Test u16" func={testU16}/>
                    <EasyButton msg="Test u32" func={testU32}/>
                    <EasyButton msg="Test u64" func={testU64}/>
                    <EasyButton msg="Test u128" func={testU128}/>
                    <EasyButton msg="Test u256" func={testU256}/>

                    <EasyTitle msg="Objects"/>
                    <EasyButton msg="Test object (Object<T>)" func={testObject}/>
                    <EasyButton msg="Test vector object (vector<Object<T>>)" func={testVectorObject}/>
                    <EasyTitle msg="Options"/>
                    <EasyButton msg="Test option Some (Option<u64>(some))" func={testOptionSome}/>
                    <EasyButton msg="Test option None (Option<u64>(none))" func={testOptionNone}/>
                    <EasyButton msg="Test vector option Some (Vector<Option<u64>>(some))"
                                func={testOptionVectorSome}/>
                    <EasyButton msg="Test vector option None (Vector<Option<u64>>(none))"
                                func={testOptionVectorNone}/>
                    <EasyTitle msg="Errors"/>
                    <EasyButton msg="Test error" func={testError}/>
                </Layout>
            }
        </>
    );
}

type ButtonState = { msg: string, state: ReturnState };
type ReturnState = "success" | "error" | undefined;
type TxnCallback = (state: ButtonState) => void;

const toState = (state: ReturnState): "success" | "error" | "info" => {
    if (state !== undefined) {
        return state
    } else {
        return "info"
    }
}

function EasyButton(props: { msg: string, func: (setState: TxnCallback) => Promise<void> }) {
    const [state, setState] = useState<ButtonState>({msg: "", state: undefined});
    return <Row align="middle">
        <Col offset={2}>
            <Button
                onClick={() => props.func(setState)}
                type="primary"
                style={{height: "40px", backgroundColor: "#3f67ff"}}
            >
                {props.msg}
            </Button>
        </Col>
        <Col offset={2}>
            {state.state &&
                <Alert type={toState(state.state)} message={state.msg}/>
            }
        </Col>
    </Row>;
}

function EasyTitle(props: { msg: string }) {
    return <Row align="middle">
        <Col offset={2}>
            <h2>{props.msg}</h2>
        </Col>
    </Row>;
}


export default App;