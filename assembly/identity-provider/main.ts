import { storage, context } from 'near-sdk-core';

import { Identity, identities, Role } from './model';

export function Initialize(): void {
  if(!storage.hasKey('provider')) {
    storage.set('provider', context.sender);
  }
}

export function ChangeProvider(new_provider: string): void {
  if(_VerifyProvider()) {
    storage.set('provider', new_provider);
  }
}

export function AddIdentity(identifier: string, address: string): void {
  const identity: Identity = new Identity(address);
  identities.set(identifier, identity);
}

export function RetrieveIdentity(identifier: string): Identity | null {
  return identities.get(identifier);
}

export function VerifyIdentity(identifier: string): bool {
  return identities.contains(identifier);
}

export function AddMetadata(identifier: string, key: string, value: string): void {
  if(VerifyIdentity(identifier)) {
    const identity: Identity = identities.get(identifier)!;
    identity.set_metadata(key, value);
  }
}

export function GetMetadata(identifier: string, key: string): string | null {
  if(VerifyIdentity(identifier)) {
    const identity: Identity = identities.get(identifier)!;
    return identity.get_metadata(key);
  } else return null;
}

export function AddRole(identifier: string, type: string): void {
  if(VerifyIdentity(identifier)) {
    const identity: Identity = identities.get(identifier)!;
    identity.add_role(type);
  }
}

export function GetRole(identifier: string, type: string): Role | null {
  if(VerifyIdentity(identifier)) {
    const identity: Identity = identities.get(identifier)!;
    return identity.get_role(type);
  } else return null;
}

function _VerifyProvider(): boolean {
  return storage.get<string>('provider') == context.sender;
}