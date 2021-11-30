import config from 'config';

import { ExecutionOptions, RecursivePartial } from '@server/helpers/types';

export const DEFAULT_EXECUTION_OPTIONS: RecursivePartial<ExecutionOptions> = { silent: config.has('core.silent') ? config.get('core.silent') : true, critical: true };

export const SERVER_ENDPOINT: string = `${config.get('server.protocol')}://${config.get('server.host')}:${config.get('server.port')}`;

export const SHUTDOWN_SIGNALS: NodeJS.Signals[] = ['SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGHUP', 'SIGILL', 'SIGINT', 'SIGQUIT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM'];
export const TIMEOUT_BEFORE_FORCED_SHUTDOWN: number = 10000;
export const SHUTDOWN_LISTENERS: { operation: string, listener: () => any | Promise<any> }[] = [];