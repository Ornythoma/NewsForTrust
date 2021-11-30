import { PersistentMap } from 'near-sdk-as';

export class Role {
  type: string;
  metadata: PersistentMap<string, string>;

  constructor(type: string, metadata: PersistentMap<string, string> = new PersistentMap<string, string>('mr')) {
    this.type = type;
    this.metadata = metadata;
  }

  get_type(): string {
    return this.type;
  }

  set_metadata(key: string, value: string): void {
    this.metadata.set(key, value);
  }

  get_metadata(key: string): string | null {
    return this.metadata.get(key);
  }
}

@nearBindgen
export class Identity {
  address: string;
  state: string;
  roles: PersistentMap<string, Role>;
  metadata: PersistentMap<string, string>;

  constructor(address: string, metadata: PersistentMap<string, string> = new PersistentMap<string, string>('mi')) {
    this.address = address;
    this.state = 'active';
    this.roles = new PersistentMap<string, Role>('r');
    this.metadata = metadata;
  }

  activate(): void {
    if(this.state == 'inactive') this.state = 'active';
  }

  deactivate(): void {
    if(this.state == 'active') this.state = 'inactive';
  }

  add_role(type: string, metadata: PersistentMap<string, string> = new PersistentMap<string, string>('r')): void {
    const role: Role = new Role(type, metadata);
    this.roles.set(type, role);
  }

  get_role(type: string): Role | null {
    return this.roles.get(type);
  }

  set_metadata(key: string, value: string): void {
    this.metadata.set(key, value);
  }

  get_metadata(key: string): string | null {
    return this.metadata.get(key);
  }
}

export const identities = new PersistentMap<string, Identity>('i');