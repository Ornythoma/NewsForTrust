import { Router } from 'express';

import { Routes } from '@server/server/routes';

const router: Router = Router({ mergeParams: true });

router.use('/', Routes);

export { router as Router };