import config from 'config';
import { Server } from 'http';

import { ExpressServer } from '@server/server/express';
import { SERVER_ENDPOINT } from '@server/helpers/constants';

const server: Server = new Server(ExpressServer);

export async function InitializeServer(): Promise<void> {
    console.log('Initializing server...');
    server.listen(config.get('server.port'), () => { console.log(`Server started: ${SERVER_ENDPOINT}`) });
}

export { server as Server };