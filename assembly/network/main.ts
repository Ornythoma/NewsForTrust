import { storage, context, ContractPromise, u128 } from 'near-sdk-core';
import { PersistentMap } from 'near-sdk-as';

import { Provider, Publisher, publishers } from './model';

export const providers = new PersistentMap<string, Provider>('p');

export function Initialize(): void {
  if(!storage.hasKey('owner')) {
    storage.set('owner', context.sender);
  }
}

export function ChangeOwner(new_owner: string): void {
  if(_VerifyOwner()) {
    storage.set('owner', new_owner);
  }
}

export function AddPublisher(identifier: string): void {
  const publisher: Publisher = new Publisher(identifier);
  publishers.set(identifier, publisher);
}

export function RetrievePublisher(identifier: string): Publisher | null {
  return publishers.get(identifier);
}

export function AddProvider(identifier: string, contract: string): void {
  const provider: Provider = new Provider(identifier, contract);
  providers.set(identifier, provider);
}

export function RetrieveProvider(provider: string): Provider | null {
  return providers.get(provider);
}

export function VerifyIdentity(provider_identifier: string, identity_identifier: string): void {
  const provider: Provider | null = providers.get(provider_identifier);
  if(provider) {
    const promise = ContractPromise.create<string>(provider.get_contract(), 'VerifyIdentity', identity_identifier, 300000000000000, u128.Zero);
    promise.returnAsResult();
  } else {
    throw new Error('Provider does not exist');
  }
}

export function AddMetadata(identifier: string, key: string, value: string): void {
  if(_VerifyOwner()) {
    const publisher: Publisher | null = publishers.get(identifier)!;
    if(publisher) publisher.set_metadata(key, value);
  }
}

export function GetMetadata(identifier: string, key: string): string | null {
  if(_VerifyOwner()) {
    const publisher: Publisher | null = publishers.get(identifier)!;
    if(publisher) return publisher.get_metadata(key);
    else return null;
  } else return null;
}

function _VerifyOwner(): boolean {
  return storage.get<string>('owner') == context.sender;
}