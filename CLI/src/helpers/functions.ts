import { AxiosResponse } from 'axios';
import { createHash as create_hash, Hash } from 'crypto';
import { omitBy as omit_by, isNil as is_nil } from 'lodash';
import { readFileSync } from 'fs';
import { exec, ShellString } from 'shelljs';

import { ExecutionOptions, HTTPEndpoint, HTTPHeaders, HTTPMethod, HTTPParameters, RecursivePartial } from '@server/helpers/types';
import { PROXY, DEFAULT_EXECUTION_OPTIONS, TIMEOUT_BEFORE_FORCED_SHUTDOWN, SHUTDOWN_LISTENERS } from '@server/helpers/constants';

export function ReadFile(location: string): Buffer {
    try {
        return readFileSync(location);
    } catch {
        throw new Error(`Could not read file: ${ location }`);
    }
}

export function ComputeSHA256(input: string | Object, salt?: string): string {
	const hash: Hash = create_hash('sha256').update((input instanceof Object) ? JSON.stringify(input) : input);
	if (salt) hash.update(ComputeSHA256(salt));
	return hash.digest('hex');
}

export async function ExecuteHTTPRequest(endpoint: HTTPEndpoint, method: HTTPMethod, content?: { headers?: HTTPHeaders, parameters?: HTTPParameters }): Promise<AxiosResponse> {
	try {
		return await PROXY.request({ method: method, url: endpoint, ...(content?.['headers'] && { headers: content['headers'] }), ...(content?.['parameters'] && { data: content['parameters'] }) });
	} catch (error) {
		console.error(`[HELPER] An error occurred while executing HTTP request: ${error}`);
        throw error;
	}
}

export function ExecuteCommand(command: string, options: RecursivePartial<ExecutionOptions> = DEFAULT_EXECUTION_OPTIONS): ShellString {
    options = Object.assign({}, DEFAULT_EXECUTION_OPTIONS, options);

    const result: ShellString = exec(command, { silent: options['silent'] });

    if (result.code !== 0) {
        console.log(result.stderr);

        if (options['critical']) {
            throw new Error(`An error occurred while executing command: ${command}`);
        }
        else return result;
    } else {
        if (options['silent'] === false) console.log(result.stdout);
        return result;
    }
}

export function RegisterProcessShutdownListener(operation: string, listener: () => any | Promise<any>): () => any | Promise<any> {
    SHUTDOWN_LISTENERS.push({ operation, listener });
    return listener;
}

export async function Shutdown(): Promise<void> {
    // console.clear();
    console.log('[CORE] Module is exiting gracefully...');

    for(const entry of SHUTDOWN_LISTENERS) {
        try {
            console.log(`[CORE] Executing operation: ${entry['operation']}`);
            await entry['listener']();
            console.log(`[CORE] Operation executed successfully: ${entry['operation']}`);
        } catch (error) {
            console.warn(`[CORE] Operation '${entry['operation']}' failed before completing: ${error}`);
        }
    }

    console.log('[CORE] All operations handled correctly. Exiting.');
    process.nextTick(() => process.exit(0));
}

export const FORCE_EXIT_FUNCTION = (timeout: number = TIMEOUT_BEFORE_FORCED_SHUTDOWN) => () => {
    setTimeout((): never => {
        console.warn(`[CORE] Module could not be stopped gracefully after ${timeout}ms: forcing shutdown`);
        return process.exit(1);
    }, timeout).unref();
};

export function InsertNewlines(n: number = 1): void {
    for (let i = 0; i < n; i++) console.log();
}

// This function does not support complex objects where a custom function is needed to perform the sort
export function Sort(object: { [key: string]: any }): Object {
    return Object.keys(omit_by(object, is_nil)).sort().reduce((accumulator: Object, key: string) => {
        if (object[key]) {
            let element: any = (typeof object[key] == 'object') ? ((object[key] instanceof Array) ? [...object[key]].sort() : Sort(object[key])) : object[key];
            return { ...accumulator, [key]: element };
        } else {
            return { ...accumulator };
        }
    }, {});
}