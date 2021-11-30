import express from 'express';

import { CORS_STRATEGY } from '@server/server/cors';
import { Router as LocalRouter } from '@server/server/router';

const server: express.Express = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(CORS_STRATEGY);
server.use('/', LocalRouter);

export { server as ExpressServer };