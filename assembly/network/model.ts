import { context } from 'near-sdk-core';
import { PersistentMap } from 'near-sdk-as';

@nearBindgen
export class Publisher {
  publisher: string;
  metadata: PersistentMap<string, string>;

  constructor(publisher: string) {
    this.publisher = publisher;
    this.metadata = new PersistentMap<string, string>('publisher_m');
  }

  get_publisher(): string {
    return this.publisher;
  }

  set_metadata(key: string, value: string): void {
    this.metadata.set(key, value);
  }

  get_metadata(key: string): string | null {
    return this.metadata.get(key);
  }
}

@nearBindgen
export class Provider {
  identifier: string;
  contract: string;
  metadata: PersistentMap<string, string>;

  constructor(identifier: string, contract: string) {
    this.identifier = identifier;
    this.contract = contract;
    this.metadata = new PersistentMap<string, string>('provider_m');
  }

  get_identifier(): string {
    return this.identifier;
  }

  get_contract(): string {
    return this.contract;
  }

  set_metadata(key: string, value: string): void {
    this.metadata.set(key, value);
  }

  get_metadata(key: string): string | null {
    return this.metadata.get(key);
  }
}

export const publishers = new PersistentMap<string, Publisher>('p');