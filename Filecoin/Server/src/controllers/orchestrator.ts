import { POWERGATE_INSTANCE, WatchJob } from '@server/controllers/powergate';

export async function AddContentToFilecoin(buffer: Uint8Array): Promise<string> {
    const { cid } = await POWERGATE_INSTANCE.ffs.addToHot(buffer);
    const { job } = await POWERGATE_INSTANCE.ffs.pushConfig(cid);
    await WatchJob(job);
    return cid;
}

export async function RetrieveContentFromFilecoin(cid: string): Promise<Buffer> {
    return await POWERGATE_INSTANCE.ffs.get(cid);
}