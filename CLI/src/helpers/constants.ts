import axios, { AxiosInstance } from 'axios';
import config from 'config';
const cp = require('child_process');

import { ExecutionOptions, RecursivePartial } from '@server/helpers/types';

export const PROXY: AxiosInstance = axios.create();

export const HOME_DIRECTORY = cp.execSync(`getent passwd \${SUDO_USER:-$USER} | cut -d: -f6 | tr -d '\n'`, { stdio: 'pipe' }).toString();

export const DEFAULT_EXECUTION_OPTIONS: RecursivePartial<ExecutionOptions> = { silent: config.has('core.silent') ? config.get('core.silent') : true, critical: true };

export const SHUTDOWN_SIGNALS: NodeJS.Signals[] = ['SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGHUP', 'SIGILL', 'SIGINT', 'SIGQUIT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM'];
export const TIMEOUT_BEFORE_FORCED_SHUTDOWN: number = 10000;
export const SHUTDOWN_LISTENERS: { operation: string, listener: () => any | Promise<any> }[] = [];