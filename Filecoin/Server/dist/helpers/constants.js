"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHUTDOWN_LISTENERS = exports.TIMEOUT_BEFORE_FORCED_SHUTDOWN = exports.SHUTDOWN_SIGNALS = exports.SERVER_ENDPOINT = exports.DEFAULT_EXECUTION_OPTIONS = void 0;
const config_1 = __importDefault(require("config"));
exports.DEFAULT_EXECUTION_OPTIONS = { silent: config_1.default.has('core.silent') ? config_1.default.get('core.silent') : true, critical: true };
exports.SERVER_ENDPOINT = `${config_1.default.get('server.protocol')}://${config_1.default.get('server.host')}:${config_1.default.get('server.port')}`;
exports.SHUTDOWN_SIGNALS = ['SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGHUP', 'SIGILL', 'SIGINT', 'SIGQUIT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM'];
exports.TIMEOUT_BEFORE_FORCED_SHUTDOWN = 10000;
exports.SHUTDOWN_LISTENERS = [];
