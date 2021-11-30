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
exports.Routes = void 0;
const orchestrator_1 = require("../controllers/orchestrator");
const express_1 = require("express");
const router = (0, express_1.Router)({ mergeParams: true });
exports.Routes = router;
router.get('/data/:cid', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cid = req.params['cid'];
    try {
        const buffer = yield (0, orchestrator_1.RetrieveContentFromFilecoin)(cid);
        res.status(200).send(JSON.parse(buffer.toString()));
    }
    catch (error) {
        console.error(`[SERVER] Error while retrieving data from Filecoin: ${error}`);
        res.status(500).send('An internal error occurred while retrieving data from Filecoin');
    }
}));
router.post('/data', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    if (!data['content']) {
        res.status(404).send('Malformed request');
    }
    else {
        try {
            const cid = yield (0, orchestrator_1.AddContentToFilecoin)(Buffer.from(JSON.stringify(data['content'])));
            res.status(200).send({ cid });
        }
        catch (error) {
            console.error(`[SERVER] Error while storing data on Filecoin: ${error}`);
            res.status(500).send('An internal error occurred while registering data on Filecoin');
        }
    }
}));
