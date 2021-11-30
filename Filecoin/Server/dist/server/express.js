"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = require("./cors");
const router_1 = require("./router");
const server = (0, express_1.default)();
exports.ExpressServer = server;
server.use(express_1.default.urlencoded({ extended: true }));
server.use(express_1.default.urlencoded({ extended: false }));
server.use(express_1.default.json());
server.use(cors_1.CORS_STRATEGY);
server.use('/', router_1.Router);
