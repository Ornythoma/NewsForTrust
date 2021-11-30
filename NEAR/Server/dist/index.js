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
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./helpers/constants");
const functions_1 = require("./helpers/functions");
const near_1 = require("./controllers/near");
const server_1 = require("./server/server");
function Initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('NEAR SERVER');
            console.log('***********');
            RegisterShutdownEvents();
            RegisterShutdownListeners();
            yield (0, near_1.InitializeNEAR)();
            yield (0, server_1.InitializeServer)();
            // await InitializeNetwork();
            // await RegisterIdentityProvider('Organisation', `${config.get('near.contracts.provider.name')}.${config.get('near.contracts.provider.account')}`)
            // await InitializeRepository(`${config.get('near.contracts.network.name')}.${config.get('near.contracts.network.account')}`);
            // AddAuthorToRepository(config.get('near.accounts.journalist.account'));
        }
        catch (error) {
            console.error('AN ERROR OCCURRED DURING INITIALIZATION');
            console.error(error);
            return yield (0, functions_1.Shutdown)();
        }
    });
}
function RegisterShutdownEvents() {
    console.log('Registering shutdown events...');
    constants_1.SHUTDOWN_SIGNALS.forEach((signal) => {
        process.on(signal, (0, functions_1.FORCE_EXIT_FUNCTION)());
        process.on(signal, functions_1.Shutdown);
    });
    process.on('beforeExit', (0, functions_1.FORCE_EXIT_FUNCTION)());
    process.on('beforeExit', functions_1.Shutdown);
    console.log('Shutdown events registered successfully');
}
function RegisterShutdownListeners() {
    console.log('Registering shutdown listeners...');
    (0, functions_1.RegisterProcessShutdownListener)('server shutdown', () => __awaiter(this, void 0, void 0, function* () { return server_1.Server.close(); }));
    console.log('Shutdown listeners registered successfully');
}
Initialize();
