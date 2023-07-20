module deploy_account::wallet_tester {

    use aptos_framework::object::{Object, create_object_from_account, ObjectCore};
    use std::option::Option;
    use std::fixed_point32::FixedPoint32;
    use aptos_std::fixed_point64::FixedPoint64;
    use std::string::String;
    use std::option;
    use aptos_framework::object;

    /// This is a test error
    const ETEST_ERROR: u64 = 12345;
    /// Option was supposed to be empty but had a value
    const EOPTION_NOT_EMPTY: u64 = 12345;
    /// Option was supposed to have a value but was empty
    const EOPTION_NOT_FILLED: u64 = 12345;

    struct TestStruct has key, drop{
    }

    public entry fun init_object(account: &signer) {
        let constructor = create_object_from_account(account);
        let signer = object::generate_signer(&constructor);
        move_to(&signer, TestStruct{});
    }

    public entry fun test_object<T>(_input: Object<T>) {
        // DO nothing
    }
    public entry fun test_object_fixed(_input: vector<Object<ObjectCore>>) {

    }

    public entry fun test_object_fixed_correct(_input: Object<ObjectCore>) {

    }

    public entry fun test_vector_object<T>(_input: vector<Object<T>>) {
        // DO nothing
    }

    public entry fun test_vector_object_fixed(_input: vector<Object<ObjectCore>>) {
        // DO nothing
    }

    public entry fun test_option(input: Option<u64>, empty: bool) {
        if (empty) {
            assert!(option::is_none(&input),  EOPTION_NOT_EMPTY);
        } else {
            assert!(option::is_some(&input),  EOPTION_NOT_FILLED);
        }
    }

    public entry fun test_option_string(input: Option<String>, empty: bool) {
        if (empty) {
            assert!(option::is_none(&input),  EOPTION_NOT_EMPTY);
        } else {
            assert!(option::is_some(&input),  EOPTION_NOT_FILLED);
        }
    }

    public entry fun test_vector_option(input: Option<vector<u64>>, empty: bool) {
        if (empty) {
            assert!(option::is_none(&input),  EOPTION_NOT_EMPTY);
        } else {
            assert!(option::is_some(&input),  EOPTION_NOT_FILLED);
        }
    }

    public entry fun test_error() {
        abort (ETEST_ERROR)
    }

    public entry fun test_bool(_input: bool) {}

    public entry fun test_address(_input: address) {}

    public entry fun test_string(_input: String) {}

    public entry fun test_u8(_input: u8) {}

    public entry fun test_u16(_input: u16) {}

    public entry fun test_u32(_input: u32) {}

    public entry fun test_u64(_input: u64) {}

    public entry fun test_u128(_input: u128) {}

    public entry fun test_u256(_input: u256) {}

    public entry fun test_f32(_input: FixedPoint32) {}

    public entry fun test_f64(_input: FixedPoint64) {}
}
