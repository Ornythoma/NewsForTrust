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
exports.WatchJob = exports.InitializePowergate = exports.POWERGATE_INSTANCE = void 0;
const config_1 = __importDefault(require("config"));
const powergate_client_1 = require("@textile/powergate-client");
function InitializePowergate() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Initializing Powergate instance...');
        const host = config_1.default.has('powergate.protocol') && config_1.default.has('powergate.host') && config_1.default.has('powergate.port') ? `${config_1.default.get('powergate.protocol')}://${config_1.default.get('powergate.host')}:${config_1.default.get('powergate.port')}` : 'http://0.0.0.0:6002';
        console.log(`Host: ${host}`);
        exports.POWERGATE_INSTANCE = (0, powergate_client_1.createPow)({ host, debug: true });
        const { token } = yield exports.POWERGATE_INSTANCE.ffs.create();
        console.log('Powergate instance created');
        console.log('Setting token...');
        exports.POWERGATE_INSTANCE.setToken(token);
        console.log('Powergate instance successfully initialized');
    });
}
exports.InitializePowergate = InitializePowergate;
function WatchJob(identifier) {
    return __awaiter(this, void 0, void 0, function* () {
        if (exports.POWERGATE_INSTANCE) {
            return new Promise((resolve, reject) => {
                exports.POWERGATE_INSTANCE.ffs.watchJobs((job) => {
                    if (job.status === powergate_client_1.ffs.JobStatus.JOB_STATUS_CANCELED) {
                        console.warn(`[POWERGATE] Job canceled: ${identifier}`);
                        reject();
                    }
                    else if (job.status === powergate_client_1.ffs.JobStatus.JOB_STATUS_FAILED) {
                        console.error(`[POWERGATE] Job failed: ${identifier}`);
                        reject();
                    }
                    else if (job.status === powergate_client_1.ffs.JobStatus.JOB_STATUS_SUCCESS) {
                        console.log(`[POWERGATE] Job succeeded: ${identifier}`);
                        resolve();
                    }
                }, identifier);
            });
        }
        else {
            throw new Error('Powergate instance not initialized');
        }
    });
}
exports.WatchJob = WatchJob;
