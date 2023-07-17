module deploy_account::wallet_tester {

    use aptos_framework::object::Object;
    use std::option::Option;

    public entry fun test_object<T>(_input: Object<T>) {
        // DO nothing
    }
    public entry fun test_vector_object<T>(_input: vector<Object<T>>) {
        // DO nothing
    }
    public entry fun test_vector_option(_input: Option<u64>) {
        // DO nothing
    }
    public entry fun test_option_vector(_input: Option<vector<u64>>) {
        // DO nothing
    }
}
