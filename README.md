## Running locally

Checkout the wallet tester

```
git clone https://github.com/gregnazario/aptos-wallet-tester.git
```

### Starting the server

Navigate to the webserver `client` folder

```
cd client
```

Now install dependencies
```
npm install
```

And then run the server, it will run on localhost:3000
```
npm start
```

You will likely need to use testnet, as devnet is not often uploaded with
the move contract from the `move` folder.

### Deploying the contract
If you're changing the contract code, you'll need to update it.

Change into the move folder
```
cd move
```

Publish the contract to devnet or testnet
```
export NETWORK="devnet"
export PROFILE="profile-name"

aptos init --profile $PROFILE --network $NETWORK

aptos move publish --named-addresses deploy_account=$PROFILE --profile $PROFILE
```

Then you will need to update the constants in the `client` folder for the address to match
