import config from 'config';
import BN from 'bn.js';
import { omit } from 'lodash';
import { Account, connect, ConnectConfig, Contract, keyStores, KeyPair, Near, WalletConnection } from 'near-api-js';

import { ReadFile } from '@server/helpers/functions';
import { AddAuthorToRepository, InitializeNetwork, InitializeRepository, RegisterIdentityProvider } from '@server/controllers/orchestrator';


export let KEYSTORE: keyStores.UnencryptedFileSystemKeyStore;
export let INSTANCE: Near;
export let WALLET: WalletConnection;
export let ACCOUNT: Account;
export const CONTRACTS: { [key: string]: Contract } = {};

export async function InitializeNEAR(): Promise<void> {
    console.log('Initializing NEAR..');
    await InitializeKeystore();
    await Connect();
    await InitializeContracts();

    if(config.get('near.deployment')) {
        await InitializeNetwork();
        await RegisterIdentityProvider(config.get('near.accounts.provider.name'), `${config.get('near.contracts.provider.name')}.${config.get('near.contracts.provider.account')}`)
        await InitializeRepository(`${config.get('near.contracts.network.name')}.${config.get('near.contracts.network.account')}`);
        AddAuthorToRepository(config.get('near.accounts.journalist.account'));
    }
    console.log('NEAR successfully initialized');
}

export async function InitializeKeystore(): Promise<void> {
    KEYSTORE = new keyStores.UnencryptedFileSystemKeyStore(config.get('near.credentials'));
    /* Main accounts should be added manually instead
    for (const data of Object.values<any>(config.get<any>('near.accounts'))) {
        console.log(`Registering account in keystore: ${data['account']}`);
        const pair = KeyPair.fromString(data['private_key']);
        await KEYSTORE.setKey(config.get('near.network'), data['account'], pair);
    }*/
}

export async function Connect(): Promise<void> {
    const configuration: ConnectConfig = {
        keyStore: KEYSTORE,
        networkId: config.get('near.network'),
        nodeUrl: config.get('near.endpoints.node'),
        walletUrl: config.get('near.endpoints.wallet'),
        helperUrl: config.get('near.endpoints.helper')
    };
    INSTANCE = await connect(configuration);
}

export async function LoadAccount(account: string): Promise<void> {
    ACCOUNT = await INSTANCE.account(account);
    console.log(`Account loaded: ${ACCOUNT.accountId}`);
}

export async function GetBalance(account: string): Promise<any> {
    return await ACCOUNT.getAccountBalance();
}

export async function InitializeContracts(): Promise<void> {
    const contracts = omit(config.get('near.contracts'), ['base']);
    for (const [reference, contract] of Object.entries<any>(contracts)) {
        if (config.get('near.deployment')) {
            console.log(`Deploying contract: ${contract['name']} (account: ${contract['account']})`);
            const pair = KeyPair.fromRandom('ed25519');
            const pub = pair.getPublicKey().toString();
            await LoadAccount(contract['account']);
            await KEYSTORE.setKey(config.get('near.network'), `${contract['name']}.${contract['account']}`, pair);
            await ACCOUNT.createAccount(`${contract['name']}.${contract['account']}`, pub, new BN('5000000000000000000000000'));
            await LoadAccount(`${contract['name']}.${contract['account']}`);
            await ACCOUNT.deployContract(ReadFile(`${config.get('near.contracts.base')}/${contract['file']}`));
        }

        CONTRACTS[reference] = new Contract(
            ACCOUNT,
            `${contract['name']}.${contract['account']}`,
            contract['methods']
        );
    }
}