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
exports.ReadFile = exports.FORCE_EXIT_FUNCTION = exports.Shutdown = exports.RegisterProcessShutdownListener = exports.ExecuteCommand = void 0;
const fs_1 = require("fs");
const shelljs_1 = require("shelljs");
const constants_1 = require("./constants");
function ExecuteCommand(command, options = constants_1.DEFAULT_EXECUTION_OPTIONS) {
    options = Object.assign({}, constants_1.DEFAULT_EXECUTION_OPTIONS, options);
    const result = (0, shelljs_1.exec)(command, { silent: options['silent'] });
    if (result.code !== 0) {
        console.log(result.stderr);
        if (options['critical']) {
            throw new Error(`An error occurred while executing command: ${command}`);
        }
        else
            return result;
    }
    else {
        if (options['silent'] === false)
            console.log(result.stdout);
        return result;
    }
}
exports.ExecuteCommand = ExecuteCommand;
function RegisterProcessShutdownListener(operation, listener) {
    constants_1.SHUTDOWN_LISTENERS.push({ operation, listener });
    return listener;
}
exports.RegisterProcessShutdownListener = RegisterProcessShutdownListener;
function Shutdown() {
    return __awaiter(this, void 0, void 0, function* () {
        // console.clear();
        console.log('[CORE] Module is exiting gracefully...');
        for (const entry of constants_1.SHUTDOWN_LISTENERS) {
            try {
                console.log(`[CORE] Executing operation: ${entry['operation']}`);
                yield entry['listener']();
                console.log(`[CORE] Operation executed successfully: ${entry['operation']}`);
            }
            catch (error) {
                console.warn(`[CORE] Operation '${entry['operation']}' failed before completing: ${error}`);
            }
        }
        console.log('[CORE] All operations handled correctly. Exiting.');
        process.nextTick(() => process.exit(0));
    });
}
exports.Shutdown = Shutdown;
const FORCE_EXIT_FUNCTION = (timeout = constants_1.TIMEOUT_BEFORE_FORCED_SHUTDOWN) => () => {
    setTimeout(() => {
        console.warn(`[CORE] Module could not be stopped gracefully after ${timeout}ms: forcing shutdown`);
        return process.exit(1);
    }, timeout).unref();
};
exports.FORCE_EXIT_FUNCTION = FORCE_EXIT_FUNCTION;
function ReadFile(location) {
    try {
        return (0, fs_1.readFileSync)(location);
    }
    catch (_a) {
        throw new Error(`Could not read file: ${location}`);
    }
}
exports.ReadFile = ReadFile;
