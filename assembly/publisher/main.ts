import { context } from "near-sdk-core";
import { PersistentSet } from "near-sdk-as";

import { repositories, Repository } from "./model";

export const administrators = new PersistentSet<string>('a');

export function Initialize(): void {
  if(administrators.size == 0) {
    administrators.add(context.sender);
  }
}

export function AddAdministrator(administrator: string): void {
  if(_VerifyAdministrator()) {
    administrators.add(administrator);
  }
}

export function RemoveAdministrator(administrator: string): void {
  if(_VerifyAdministrator()) {
    administrators.delete(administrator);
  }
}

export function AddRepository(name: string, contract: string): void {
  if(_VerifyAdministrator()) {
    const repository: Repository = new Repository(contract);
    repositories.set(name, repository);
  }
}

export function RetrieveRepository(name: string): Repository | null {
  return repositories.get(name);
}

export function RetrieveContract(repository: string): string | null {
  const entry: Repository | null = repositories.get(repository);
  return entry ? entry.get_contract() : null;
}

export function AddMetadata(identifier: string, key: string, value: string): void {
  if(_VerifyAdministrator()) {
    const repository: Repository | null = repositories.get(identifier)!;
    if(repository) repository.set_metadata(key, value);
  }
}

export function GetMetadata(identifier: string, key: string): string | null {
  if(_VerifyAdministrator()) {
    const repository: Repository | null = repositories.get(identifier)!;
    if(repository) return repository.get_metadata(key);
    else return null;
  } else return null;
}

function _VerifyAdministrator(): bool {
  return administrators.has(context.sender);
}
