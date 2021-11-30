import { context } from 'near-sdk-core';
import { PersistentMap } from 'near-sdk-as';

@nearBindgen
export class Repository {
  status: string;
  contract: string;
  creation: u64;
  metadata: PersistentMap<string, string>;

  constructor(contract: string, metadata: PersistentMap<string, string> = new PersistentMap<string, string>('m')) {
    this.contract = contract;
    this.status = 'active';
    this.creation = context.blockTimestamp;
    this.metadata = metadata;
  }

  get_contract(): string {
    return this.contract;
  }

  activate(): void {
    if(this.status == 'inactive') this.status = 'active';
  }

  deactivate(): void {
    if(this.status == 'active') this.status = 'inactive';
  }

  set_metadata(key: string, value: string): void {
    this.metadata.set(key, value);
  }

  get_metadata(key: string): string | null {
    return this.metadata.get(key);
  }
}

export const repositories = new PersistentMap<string, Repository>('r');