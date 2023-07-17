import {Alert, Button, Col, Layout, Row} from "antd";
import {WalletSelector} from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import {Network, Provider, Types} from "aptos";
import {useWallet} from "@aptos-labs/wallet-adapter-react";

// TODO: Load URL from wallet
export const CLIENT = new Provider(Network.DEVNET);

// TODO: make this more accessible / be deployed by others?
export const MODULE_ADDRESS = "0xb11affd5c514bb969e988710ef57813d9556cc1e3fe6dc9aa6a82b56aee53d98";


function App(this: any) {
    const {network, connected, signAndSubmitTransaction} = useWallet();

    const isDevnet = (): boolean => {
        return (network?.name as string).toLowerCase() === 'devnet';
    }

    const testObject = async () => {
        await runTransaction(
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_object`,
                type_arguments: ["0x1::object::ObjectCore"],
                arguments: [
                    "0x12345",
                ],
            })
    }

    const testVectorObject = async () => {
        await runTransaction(
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_vector_object`,
                type_arguments: ["0x1::object::ObjectCore"],
                arguments: [
                    ["0x12345", "0x54321"],
                ],
            })

        await runTransaction(
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_vector_object`,
                type_arguments: ["0x1::object::ObjectCore"],
                arguments: [
                    [],
                ],
            })
    }

    const testOptionSome = async () => {
        await runTransaction(
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_vector_option`,
                type_arguments: [],
                arguments: [
                    "12345",
                ],
            })

    }

    const testOptionNone = async () => {
        await runTransaction(
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_vector_option`,
                type_arguments: [],
                arguments: [
                    undefined,
                ],
            })
    }

    const testOptionVectorSome = async () => {
        await runTransaction(
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_option_vector`,
                type_arguments: [],
                arguments: [
                    ["12345", "54"],
                ],
            })
    }
    const testOptionVectorNone = async () => {
        await runTransaction(
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_vector_option`,
                type_arguments: [],
                arguments: [
                    undefined, "12345"
                ],
            })
    }

    const testError = async () => {
        await runTransaction(
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_error`,
                type_arguments: [],
                arguments: [],
            })
    }

    const testU8 = async () => {
        await runTransaction(
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_u8`,
                type_arguments: [],
                arguments: [
                    255
                ],
            })
    }

    const testU16 = async () => {
        await runTransaction(
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_u16`,
                type_arguments: [],
                arguments: [
                    65535
                ],
            })
    }

    const testU32 = async () => {
        await runTransaction(
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_u32`,
                type_arguments: [],
                arguments: [
                    4294967295

                ],
            })
    }

    const testU64 = async () => {
        await runTransaction(
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_u64`,
                type_arguments: [],
                arguments: [
                    "18446744073709551615"
                ],
            })
    }

    const testU128 = async () => {
        await runTransaction(
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_u128`,
                type_arguments: [],
                arguments: [
                    "340282366920938463463374607431768211455"
                ],
            })
    }

    const testU256 = async () => {
        await runTransaction(
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_u256`,
                type_arguments: [],
                arguments: [
                    "115792089237316195423570985008687907853269984665640564039457584007913129639935"
                ],
            })
    }

    const testF32 = async () => {
        await runTransaction(
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_f32`,
                type_arguments: [],
                arguments: [
                    0
                ],
            })
    }

    const testF64 = async () => {
        await runTransaction(
            {
                type: "entry_function_payload",
                function: `${MODULE_ADDRESS}::wallet_tester::test_f64`,
                type_arguments: [],
                arguments: [
                    0
                ],
            })
    }

    const runTransaction = async <T extends Types.TransactionPayload>(payload: T) => {
        console.log(`Running payload: ${payload}`);
        try {
            const response = await signAndSubmitTransaction(payload);
            console.log(`Successfully submitted`);
            await CLIENT.waitForTransaction(response.hash);
            console.log(`Successfully committed`);
            let txn = await CLIENT.getTransactionByHash(response.hash) as any;
            console.log(`Txn: ${txn}`);
            return txn;
        } catch (error: any) {
            console.log("Failed to wait for txn" + error)
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
                    <Row align="middle">
                        <Col offset={2}></Col>
                        <EasyButton msg="Test u8" func={() => testU8()}/>
                        <EasyButton msg="Test u16" func={() => testU16()}/>
                        <EasyButton msg="Test u32" func={() => testU32()}/>
                        <EasyButton msg="Test u64" func={() => testU64()}/>
                        <EasyButton msg="Test u128" func={() => testU128()}/>
                        <EasyButton msg="Test u256" func={() => testU256()}/>
                    </Row>

                    <EasyTitle msg="Fixed Point"/>
                    <Row align="middle">
                        <Col offset={2}></Col>
                        <EasyButton msg="Test f32" func={() => testF32()}/>
                        <EasyButton msg="Test f64" func={() => testF64()}/>
                    </Row>
                    <EasyTitle msg="Objects"/>
                    <Row align="middle">
                        <Col offset={2}></Col>
                        <EasyButton msg="Test object (Object<T>)" func={() => testObject()}/>
                        <EasyButton msg="Test vector object (vector<Object<T>>)" func={() => testVectorObject()}/>
                    </Row>
                    <EasyTitle msg="Options"/>
                    <Row align="middle">
                        <Col offset={2}></Col>
                        <EasyButton msg="Test option Some (Option<u64>(some))" func={() => testOptionSome()}/>
                        <EasyButton msg="Test option None (Option<u64>(none))" func={() => testOptionNone()}/>
                        <EasyButton msg="Test vector option Some (Vector<Option<u64>>(some))"
                                    func={() => testOptionVectorSome()}/>
                        <EasyButton msg="Test vector option None (Vector<Option<u64>>(none))"
                                    func={() => testOptionVectorNone()}/>
                    </Row>
                    <EasyTitle msg="Errors"/>
                    <Row align="middle">
                        <Col offset={2}></Col>
                        <EasyButton msg="Test error" func={() => testError()}/>
                    </Row>
                </Layout>
            }
        </>
    );
}

function EasyButton(props: { msg: string, func: () => Promise<void> }) {
    return <Col>
        <Button
            onClick={props.func}
            type="primary"
            style={{height: "40px", backgroundColor: "#3f67ff"}}
        >
            {props.msg}
        </Button>
    </Col>
        ;
}

function EasyTitle(props: { msg: string }) {
    return <Row align="middle">
        <Col offset={2}>
            <h2>{props.msg}</h2>
        </Col>
    </Row>;
}


export default App;