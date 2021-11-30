"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const express_1 = require("express");
const routes_1 = require("./routes");
const router = (0, express_1.Router)({ mergeParams: true });
exports.Router = router;
router.use('/', routes_1.Routes);
