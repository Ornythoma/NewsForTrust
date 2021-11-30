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
exports.RetrieveContentFromFilecoin = exports.AddContentToFilecoin = void 0;
const powergate_1 = require("./powergate");
function AddContentToFilecoin(buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        const { cid } = yield powergate_1.POWERGATE_INSTANCE.ffs.addToHot(buffer);
        const { job } = yield powergate_1.POWERGATE_INSTANCE.ffs.pushConfig(cid);
        yield (0, powergate_1.WatchJob)(job);
        return cid;
    });
}
exports.AddContentToFilecoin = AddContentToFilecoin;
function RetrieveContentFromFilecoin(cid) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield powergate_1.POWERGATE_INSTANCE.ffs.get(cid);
    });
}
exports.RetrieveContentFromFilecoin = RetrieveContentFromFilecoin;
