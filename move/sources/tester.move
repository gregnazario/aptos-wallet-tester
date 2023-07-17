module deploy_account::wallet_tester {

    use aptos_framework::object::Object;
    use std::option::Option;
    use std::fixed_point32::FixedPoint32;
    use aptos_std::fixed_point64::FixedPoint64;

    /// This is a test error
    const ETEST_ERROR: u64 = 12345;

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

    public entry fun test_error() {
        abort(ETEST_ERROR)
    }

    public entry fun test_u8(_input: u8) {
        // Do nothing
    }
    public entry fun test_u16(_input: u16) {
        // Do nothing
    }
    public entry fun test_u32(_input: u32) {
        // Do nothing
    }
    public entry fun test_u64(_input: u64) {
        // Do nothing
    }
    public entry fun test_u128(_input: u128) {
        // Do nothing
    }
    public entry fun test_u256(_input: u256) {
        // Do nothing
    }

    public entry fun test_f32(_input: FixedPoint32) {
        // Do nothing
    }

    public entry fun test_f64(_input: FixedPoint64) {
        // Do nothing
    }
}
