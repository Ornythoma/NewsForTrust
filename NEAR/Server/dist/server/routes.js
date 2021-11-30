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
const express_1 = require("express");
const orchestrator_1 = require("../controllers/orchestrator");
const router = (0, express_1.Router)({ mergeParams: true });
exports.Routes = router;
router.get('/articles/:identifier', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const identifier = req.params['identifier'];
    try {
        const article = yield (0, orchestrator_1.GetArticleFromRepository)(identifier);
        res.status(200).send(article);
    }
    catch (error) {
        console.error(`[SERVER] Error while retrieving data from repository: ${error}`);
        res.status(500).send('An internal error occurred while retrieving data from repository');
    }
}));
router.post('/articles', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const article = req.body['article'];
    const author = req.body['author'];
    if (!author || !article['identifier'] || !article['initial_version'] || !article['signature'] || !article['provider']) {
        res.status(404).send('Malformed request');
    }
    else {
        try {
            yield (0, orchestrator_1.AddArticleToRepository)(article, author);
            res.status(200).send(article);
        }
        catch (error) {
            console.error(`[SERVER] Error while storing article: ${error}`);
            res.status(500).send('An internal error occurred while registering article in repository');
        }
    }
}));
router.get('/articles/:article/version/:version/comments/:comment', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const article_identifier = req.params['article'];
    const article_version = req.params['version'];
    const comment_identifier = req.params['comment'];
    try {
        const comment = yield (0, orchestrator_1.GetComment)(article_identifier, article_version, comment_identifier);
        res.status(200).send(comment);
    }
    catch (error) {
        console.error(`[SERVER] Error while retrieving data from repository: ${error}`);
        res.status(500).send('An internal error occurred while retrieving data from repository');
    }
}));
router.post('/articles/:article/version/:version/comments', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const article = req.params['article'];
    const version = req.params['version'];
    const comment = req.body['comment'];
    const author = req.body['author'];
    if (!author || !comment['comment_identifier'] || !comment['type'] || !comment['signature'] || !comment['provider']) {
        res.status(404).send('Malformed request');
    }
    else {
        try {
            yield (0, orchestrator_1.AddCommentToRepository)(Object.assign(comment, { 'article_identifier': article, 'version_identifier': version }), author);
            res.status(200).send(comment);
        }
        catch (error) {
            console.error(`[SERVER] Error while storing comment: ${error}`);
            res.status(500).send('An internal error occurred while associating comment to article');
        }
    }
}));
