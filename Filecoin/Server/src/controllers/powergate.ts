import config from 'config';
import { createPow as create_powergate_instance, ffs } from '@textile/powergate-client';

export let POWERGATE_INSTANCE: any;

export async function InitializePowergate(): Promise<void> {
    console.log('Initializing Powergate instance...');
    const host: string = config.has('powergate.protocol') && config.has('powergate.host') && config.has('powergate.port') ? `${config.get('powergate.protocol')}://${config.get('powergate.host')}:${config.get('powergate.port')}` : 'http://0.0.0.0:6002';
    console.log(`Host: ${ host }`);
    POWERGATE_INSTANCE = create_powergate_instance({ host, debug: true });
    const { token } = await POWERGATE_INSTANCE.ffs.create();
    console.log('Powergate instance created');
    console.log('Setting token...')
    POWERGATE_INSTANCE.setToken(token);
    console.log('Powergate instance successfully initialized');
}

export async function WatchJob(identifier: string): Promise<void> {
    if(POWERGATE_INSTANCE) {
        return new Promise((resolve: () => void, reject: () => void) => {
            POWERGATE_INSTANCE.ffs.watchJobs((job: ffs.Job.AsObject) => {
                if (job.status === ffs.JobStatus.JOB_STATUS_CANCELED) {
                  console.warn(`[POWERGATE] Job canceled: ${identifier}`);
                  reject();
                } else if (job.status === ffs.JobStatus.JOB_STATUS_FAILED) {
                    console.error(`[POWERGATE] Job failed: ${identifier}`);
                    reject();
                } else if (job.status === ffs.JobStatus.JOB_STATUS_SUCCESS) {
                    console.log(`[POWERGATE] Job succeeded: ${identifier}`);
                    resolve();
                }
              }, identifier);
        }); 
    } else {
        throw new Error('Powergate instance not initialized');
    }
}