"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployContracts = exports.GetBalance = exports.LoadAccount = exports.Connect = exports.InitializeKeystore = exports.InitializeNEAR = exports.CONTRACTS = exports.ACCOUNT = exports.WALLET = exports.INSTANCE = exports.KEYSTORE = void 0;
const config_1 = __importDefault(require("config"));
const bn_js_1 = __importDefault(require("bn.js"));
const lodash_1 = require("lodash");
const near_api_js_1 = require("near-api-js");
const functions_1 = require("../helpers/functions");
exports.CONTRACTS = {};
function InitializeNEAR() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Initializing NEAR..');
        yield InitializeKeystore();
        yield Connect();
        //await DeployContracts();
        console.log('NEAR successfully initialized');
    });
}
exports.InitializeNEAR = InitializeNEAR;
function InitializeKeystore() {
    return __awaiter(this, void 0, void 0, function* () {
        exports.KEYSTORE = new near_api_js_1.keyStores.UnencryptedFileSystemKeyStore(config_1.default.get('near.credentials'));
        /*for (const data of Object.values<any>(config.get<any>('near.accounts'))) {
            console.log(`Registering account in keystore: ${data['account']}`);
            const pair = KeyPair.fromString(data['private_key']);
            await KEYSTORE.setKey(config.get('near.network'), data['account'], pair);
        }*/
    });
}
exports.InitializeKeystore = InitializeKeystore;
function Connect() {
    return __awaiter(this, void 0, void 0, function* () {
        const configuration = {
            keyStore: exports.KEYSTORE,
            networkId: config_1.default.get('near.network'),
            nodeUrl: config_1.default.get('near.endpoints.node'),
            walletUrl: config_1.default.get('near.endpoints.wallet'),
            helperUrl: config_1.default.get('near.endpoints.helper')
        };
        exports.INSTANCE = yield (0, near_api_js_1.connect)(configuration);
    });
}
exports.Connect = Connect;
function LoadAccount(account) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.ACCOUNT = yield exports.INSTANCE.account(account);
        console.log(`Account loaded: ${exports.ACCOUNT.accountId}`);
    });
}
exports.LoadAccount = LoadAccount;
function GetBalance(account) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.ACCOUNT.getAccountBalance();
    });
}
exports.GetBalance = GetBalance;
function DeployContracts() {
    return __awaiter(this, void 0, void 0, function* () {
        const contracts = (0, lodash_1.omit)(config_1.default.get('near.contracts'), ['base']);
        for (const [reference, contract] of Object.entries(contracts)) {
            console.log(`Deploying contract: ${contract['name']} (account: ${contract['account']})`);
            const pair = near_api_js_1.KeyPair.fromRandom('ed25519');
            const pub = pair.getPublicKey().toString();
            yield LoadAccount(contract['account']);
            yield exports.KEYSTORE.setKey(config_1.default.get('near.network'), `${contract['name']}.${contract['account']}`, pair);
            yield exports.ACCOUNT.createAccount(`${contract['name']}.${contract['account']}`, pub, new bn_js_1.default('1000000000000000000000000'));
            yield LoadAccount(`${contract['name']}.${contract['account']}`);
            yield exports.ACCOUNT.deployContract((0, functions_1.ReadFile)(`${config_1.default.get('near.contracts.base')}/${contract['file']}`));
            exports.CONTRACTS[reference] = new near_api_js_1.Contract(exports.ACCOUNT, `${contract['name']}.${contract['account']}`, contract['methods']);
        }
    });
}
exports.DeployContracts = DeployContracts;
