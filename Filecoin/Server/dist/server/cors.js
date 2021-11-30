"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORS_STRATEGY = void 0;
const config_1 = __importDefault(require("config"));
const cors = require("cors");
exports.CORS_STRATEGY = cors({
    origin: (origin, callback) => {
        if (!origin)
            callback(null, false);
        else
            VerifyCORS(origin, callback);
    }, credentials: true
});
const AUTHORIZED_ENDPOINTS = config_1.default.has('server.authorized_clients') ? config_1.default.get('server.authorized_clients') : [];
function VerifyCORS(origin, callback) {
    if (AUTHORIZED_ENDPOINTS.includes(origin)) {
        callback(null, true);
    }
    else {
        callback(null, false);
    }
    ;
}
