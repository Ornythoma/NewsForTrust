import { NextFunction, Request, Response, Router } from 'express';

import { AddArticleToRepository, AddCommentToRepository, GetArticleFromRepository, GetComment } from '@server/controllers/orchestrator';
import { Article, Comment } from '@server/helpers/types';

const router: Router = Router({ mergeParams: true });


router.get('/articles/:identifier', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const identifier: string = req.params['identifier'];

	try {
        const article: Article = await GetArticleFromRepository(identifier);
		res.status(200).send(article);
	} catch(error) {
		console.error(`[SERVER] Error while retrieving data from repository: ${ error }`);
		res.status(500).send('An internal error occurred while retrieving data from repository');
	}
});

router.post('/articles', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const article: Article = req.body['article'];
    const author: string = req.body['author'];

	if(!author|| !article['identifier'] || !article['initial_version'] || !article['signature'] || !article['provider']) {
		res.status(404).send('Malformed request');
	} else {
		try {
			await AddArticleToRepository(article, author);
			res.status(200).send(article);
		} catch(error) {
			console.error(`[SERVER] Error while storing article: ${ error }`);
			res.status(500).send('An internal error occurred while registering article in repository');
		}
	}
});

router.get('/articles/:article/version/:version/comments/:comment', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const article_identifier: string = req.params['article'];
    const article_version: string = req.params['version'];
    const comment_identifier: string = req.params['comment'];

	try {
        const comment: Comment = await GetComment(article_identifier, article_version, comment_identifier);
		res.status(200).send(comment);
	} catch(error) {
		console.error(`[SERVER] Error while retrieving data from repository: ${ error }`);
		res.status(500).send('An internal error occurred while retrieving data from repository');
	}
});

router.post('/articles/:article/version/:version/comments', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const article: string = req.params['article'];
    const version: string = req.params['version'];
    const comment: Omit<Comment, 'article_identifier' | 'version_identifier'> = req.body['comment'];
    const author: string = req.body['author'];
    if(!author || !comment['comment_identifier'] || !comment['type'] || !comment['signature'] || !comment['provider']) {
		res.status(404).send('Malformed request');
	} else {
		try {
			await AddCommentToRepository(Object.assign(comment, { 'article_identifier': article, 'version_identifier': version }), author);
			res.status(200).send(comment);
		} catch(error) {
			console.error(`[SERVER] Error while storing comment: ${ error }`);
			res.status(500).send('An internal error occurred while associating comment to article');
		}
	}
});

export { router as Routes };