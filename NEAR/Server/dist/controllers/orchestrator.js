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
exports.GetComment = exports.AddCommentToRepository = exports.GetArticleFromRepository = exports.AddArticleToRepository = exports.AddAuthorToRepository = exports.InitializeRepository = exports.RegisterIdentityProvider = exports.InitializeNetwork = void 0;
const config_1 = __importDefault(require("config"));
const near_api_js_1 = require("near-api-js");
const near_1 = require("./near");
function InitializeNetwork() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, near_1.LoadAccount)(`${config_1.default.get('near.contracts.network.name')}.${config_1.default.get('near.contracts.network.account')}`);
        yield near_1.CONTRACTS['network'].Initialize({ args: {} });
    });
}
exports.InitializeNetwork = InitializeNetwork;
function RegisterIdentityProvider(identifier, contract) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, near_1.LoadAccount)(`${config_1.default.get('near.contracts.network.name')}.${config_1.default.get('near.contracts.network.account')}`);
        yield near_1.CONTRACTS['network'].AddProvider({ args: { identifier, contract } });
    });
}
exports.RegisterIdentityProvider = RegisterIdentityProvider;
function InitializeRepository(network) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, near_1.LoadAccount)(`${config_1.default.get('near.contracts.repository.name')}.${config_1.default.get('near.contracts.repository.account')}`);
        yield near_1.CONTRACTS['repository'].Initialize({ args: { 'network': network } });
    });
}
exports.InitializeRepository = InitializeRepository;
function AddAuthorToRepository(author) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, near_1.LoadAccount)(`${config_1.default.get('near.contracts.repository.name')}.${config_1.default.get('near.contracts.repository.account')}`);
        yield near_1.CONTRACTS['repository'].AddAuthor({ args: { 'author': author } });
    });
}
exports.AddAuthorToRepository = AddAuthorToRepository;
function AddArticleToRepository(article, author) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, near_1.LoadAccount)(author);
        const contract_called_by_author = new near_api_js_1.Contract(near_1.ACCOUNT, `${config_1.default.get('near.contracts.repository.name')}.${config_1.default.get('near.contracts.repository.account')}`, config_1.default.get('near.contracts.repository.methods'));
        yield contract_called_by_author.AddArticle({ args: article });
    });
}
exports.AddArticleToRepository = AddArticleToRepository;
function GetArticleFromRepository(identifier) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, near_1.LoadAccount)(`${config_1.default.get('near.contracts.repository.name')}.${config_1.default.get('near.contracts.repository.account')}`);
        return JSON.parse(yield near_1.CONTRACTS['repository'].GetArticle({ identifier }));
    });
}
exports.GetArticleFromRepository = GetArticleFromRepository;
function AddCommentToRepository(comment, author) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, near_1.LoadAccount)(author);
        const contract_called_by_author = new near_api_js_1.Contract(near_1.ACCOUNT, `${config_1.default.get('near.contracts.repository.name')}.${config_1.default.get('near.contracts.repository.account')}`, config_1.default.get('near.contracts.repository.methods'));
        yield contract_called_by_author.AddComment({ args: comment });
    });
}
exports.AddCommentToRepository = AddCommentToRepository;
function GetComment(article, version, comment) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, near_1.LoadAccount)(`${config_1.default.get('near.contracts.repository.name')}.${config_1.default.get('near.contracts.repository.account')}`);
        near_1.CONTRACTS['repository'] = new near_api_js_1.Contract(near_1.ACCOUNT, `${config_1.default.get('near.contracts.repository.name')}.${config_1.default.get('near.contracts.repository.account')}`, config_1.default.get('near.contracts.repository.methods'));
        return yield near_1.CONTRACTS['repository'].GetComment({ article_identifier: article, version_identifier: version, comment_identifier: comment });
    });
}
exports.GetComment = GetComment;
