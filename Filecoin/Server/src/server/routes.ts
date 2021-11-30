import { AddContentToFilecoin, RetrieveContentFromFilecoin } from '@server/controllers/orchestrator';
import { NextFunction, Request, Response, Router } from 'express';

const router: Router = Router({ mergeParams: true });

router.get('/data/:cid', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const cid: string = req.params['cid'];

	try {
		const buffer: Buffer = await RetrieveContentFromFilecoin(cid);
		res.status(200).send(JSON.parse(buffer.toString()));
	} catch(error) {
		console.error(`[SERVER] Error while retrieving data from Filecoin: ${ error }`);
		res.status(500).send('An internal error occurred while retrieving data from Filecoin');
	}
});

router.post('/data', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const data: any = req.body;

	if(!data['content']) {
		res.status(404).send('Malformed request');
	} else {
		try {
			const cid: string = await AddContentToFilecoin(Buffer.from(JSON.stringify(data['content'])));
			res.status(200).send({ cid });
		} catch(error) {
			console.error(`[SERVER] Error while storing data on Filecoin: ${ error }`);
			res.status(500).send('An internal error occurred while registering data on Filecoin');
		}
	}
});

export { router as Routes };