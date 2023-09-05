module deploy_account::wallet_tester {

    use std::fixed_point32;
    use aptos_framework::object::{Object, create_object_from_account, ObjectCore};
    use std::option::{Option, none, some};
    use std::fixed_point32::FixedPoint32;
    use aptos_std::fixed_point64::FixedPoint64;
    use std::string::{String, utf8};
    use std::option;
    use aptos_framework::object;
    use aptos_std::fixed_point64;

    /// This is a test error
    const ETEST_ERROR: u64 = 12345;
    /// Option was supposed to be empty but had a value
    const EOPTION_NOT_EMPTY: u64 = 12345;
    /// Option was supposed to have a value but was empty
    const EOPTION_NOT_FILLED: u64 = 12345;

    struct TestStruct has key, drop {}

    public entry fun init_object(account: &signer) {
        let constructor = create_object_from_account(account);
        let signer = object::generate_signer(&constructor);
        move_to(&signer, TestStruct {});
    }

    public entry fun test_object<T>(_input: Object<T>) {
        // DO nothing
    }

    public entry fun test_object_fixed(_input: vector<Object<ObjectCore>>) {}

    public entry fun test_object_fixed_correct(_input: Object<ObjectCore>) {}

    public entry fun test_vector_object<T>(_input: vector<Object<T>>) {
        // DO nothing
    }

    public entry fun test_vector_object_fixed(_input: vector<Object<ObjectCore>>) {
        // DO nothing
    }

    public entry fun test_option(input: Option<u64>, empty: bool) {
        if (empty) {
            assert!(option::is_none(&input), EOPTION_NOT_EMPTY);
        } else {
            assert!(option::is_some(&input), EOPTION_NOT_FILLED);
        }
    }

    public entry fun test_option_string(input: Option<String>, empty: bool) {
        if (empty) {
            assert!(option::is_none(&input), EOPTION_NOT_EMPTY);
        } else {
            assert!(option::is_some(&input), EOPTION_NOT_FILLED);
        }
    }

    public entry fun test_vector_option(input: Option<vector<u64>>, empty: bool) {
        if (empty) {
            assert!(option::is_none(&input), EOPTION_NOT_EMPTY);
        } else {
            assert!(option::is_some(&input), EOPTION_NOT_FILLED);
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


    #[view]
    public fun view_bool(input: bool): bool { input }

    #[view]
    public fun view_address(input: address): address { input }

    #[view]
    public fun view_string(input: String): String { input }

    #[view]
    public fun view_u8(input: u8): u8 { input }

    #[view]
    public fun view_u16(input: u16): u16 { input }

    #[view]
    public fun view_u32(input: u32): u32 { input }

    #[view]
    public fun view_u64(input: u64): u64 { input }

    #[view]
    public fun view_u128(input: u128): u128 { input }

    #[view]
    public fun view_u256(input: u256): u256 { input }

    #[view]
    public fun view_vecu8(input: vector<u8>): vector<u8> { input }

    #[view]
    public fun view_vecu64(input: vector<u64>): vector<u64> { input }

    #[view]
    public fun view_f32_output(): FixedPoint32 {
        fixed_point32::create_from_rational(1, 2)
    }

    #[view]
    public fun view_f64_output(): FixedPoint64 {
        fixed_point64::create_from_rational(1, 2)
    }

    #[view]
    public fun view_tuple(): (address, bool, u64) {
        (@0x1, true, 1234567)
    }

    struct NestedStruct {
        before: bool,
        inner: InnerStruct,
        after: bool,
    }

    struct InnerStruct {
        value: u8,
        option: Option<String>,
        object: Object<ObjectCore>
    }

    struct SimpleStruct {
        bool: bool,
        u8: u8,
        u16: u16,
        u32: u32,
        u64: u64,
        u128: u128,
        u256: u256,
        address: address,
        string: String,
        vecu8: vector<u8>,
        option: Option<String>,
    }

    #[view]
    public fun view_struct(): SimpleStruct {
        SimpleStruct {
            bool: true,
            u8: 255,
            u16: 65535,
            u32: 4294967295,
            u64: 18446744073709551615,
            u128: 340282366920938463463374607431768211455,
            u256: 115792089237316195423570985008687907853269984665640564039457584007913129639935,
            address: @0x1,
            string: utf8(b"Hello world"),
            vecu8: b"I am a vector",
            option: none(),
        }
    }

    #[view]
    public fun view_nested_struct(object_address: address): NestedStruct {
        NestedStruct {
            before: true,
            inner: InnerStruct {
                value: 255,
                option: some(utf8(b"Option is here!")),
                object: object::address_to_object(object_address)
            },
            after: true,
        }
    }

    #[view]
    public fun view_object_fixed(object: Object<ObjectCore>): Object<ObjectCore> {
        object
    }

    #[view]
    public fun view_object_variable<T>(object: Object<T>): Object<T> {
        object
    }

    #[view]
    public fun view_option(option: Option<String>): Option<String> {
        option
    }
}
