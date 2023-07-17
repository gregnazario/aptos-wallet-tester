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
                    <EasyButton msg="Test object (Option<T>)" func={() => testObject()}/>
                    <EasyButton msg="Test vector object (vector<Option<T>>)" func={() => testVectorObject()}/>
                    <EasyButton msg="Test option Some (Option<u64>(some))" func={() => testOptionSome()}/>
                    <EasyButton msg="Test option None (Option<u64>(none))" func={() => testOptionNone()}/>
                    <EasyButton msg="Test vector option Some (Vector<Option<u64>>(some))" func={() => testOptionVectorSome()}/>
                    <EasyButton msg="Test vector option None (Vector<Option<u64>>(none))" func={() => testOptionVectorNone()}/>
                </Layout>
            }
        </>
    );
}

function EasyButton(props: { msg: string, func: () => Promise<void> }) {
    return <Row align="middle">
        <Col offset={2}>
            <Button
                onClick={props.func}
                type="primary"
                style={{height: "40px", backgroundColor: "#3f67ff"}}
            >
                {props.msg}
            </Button>
        </Col>
    </Row>;
}


export default App;