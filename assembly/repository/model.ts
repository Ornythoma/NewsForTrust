import { context } from 'near-sdk-core';
import { PersistentMap } from 'near-sdk-as';

export enum CommentType {
  ADDITION = 1,
  MODIFICATION = 2,
  CONTRADICTION = 3
}

@nearBindgen
export class Identity {
  provider: string;
  identifier: string;

  constructor(provider: string, identifier: string) {
    this.provider = provider;
    this.identifier = identifier;
  }

  get_provider(): string {
    return this.provider;
  }

  get_identifier(): string {
    return this.identifier;
  }
}

@nearBindgen
export class Response {
  identifier: string;
  author: Identity;
  signature: string;
  date: u64;
  metadata: PersistentMap<string, string>;

  constructor(identifier: string, author: Identity, signature: string, metadata: PersistentMap<string, string> = new PersistentMap<string, string>('mr')) {
    this.identifier = identifier;
    this.author = author;
    this.signature = signature;
    this.date = context.blockTimestamp;
    this.metadata = metadata;
  }

  get_identifier(): string {
    return this.identifier;
  }

  get_author(): Identity {
    return this.author;
  }

  get_signature(): string {
    return this.signature;
  }

  set_metadata(key: string, value: string): void {
    // As a comment can have multiple responses and as Near uses a unique key/value store per contract, we mimic the management of the metadata by using sub-prefixes
    this.metadata.set(this.identifier + key, value);
  }

  get_metadata(key: string): string | null {
    return this.metadata.get(key);
  }
}

@nearBindgen
export class Comment {
  identifier: string;
  article_version: string;
  author: Identity;
  signature: string;
  type: CommentType;
  date: u64;
  responses: PersistentMap<string, Response>;
  metadata: PersistentMap<string, string>;

  constructor(identifier: string, article_version: string, author: Identity, signature: string, type: CommentType, metadata: PersistentMap<string, string> = new PersistentMap<string, string>('mc')) {
    this.identifier = identifier;
    this.author = author;
    this.signature = signature;
    this.type = type;
    this.date = context.blockTimestamp;
    this.metadata = metadata;
    this.article_version = article_version;
    this.responses = new PersistentMap<string, Response>('r');
  }

  get_identifier(): string {
    return this.identifier;
  }

  get_article_version(): string {
    return this.article_version;
  }

  get_author(): Identity {
    return this.author;
  }

  get_signature(): string {
    return this.signature;
  }

  get_type(): CommentType {
    return this.type;
  }

  add_response(response: Response): void {
    this.responses.set(response.get_identifier(), response);
  }

  get_response(identifier: string): Response | null {
    return this.responses.get(identifier);
  }

  set_metadata(key: string, value: string): void {
    // As an article can have multiple comments and as Near uses a unique key/value store per contract, we mimic the management of the metadata by using sub-prefixes
    this.metadata.set(this.identifier + key, value);
  }

  get_metadata(key: string): string | null {
    return this.metadata.get(key);
  }
}

@nearBindgen
export class Version {
  identifier: string;
  version: string;
  signature: string;
  date: u64;

  constructor(identifier: string, version: string, signature: string) {
    this.identifier = identifier;
    this.version = version;
    this.signature = signature;
    this.date = context.blockTimestamp;
  }

  get_identifier(): string {
    return this.identifier;
  }

  get_version(): string {
    return this.version;
  }

  get_signature(): string {
    return this.signature;
  }
}

@nearBindgen
export class Article {
  identifier: string;
  author: Identity;
  versions: Version[];
  comments: PersistentMap<string, Comment>;
  metadata: PersistentMap<string, string>;

  constructor(identifier: string, author: Identity, version: Version, metadata: PersistentMap<string, string> = new PersistentMap<string, string>('ma')) {
    this.identifier = identifier;
    this.author = author;
    this.versions = [];
    this.versions.push(version);
    this.metadata = metadata;
    this.comments = new PersistentMap<string, Comment>('c');
  }

  get_identifier(): string {
    return this.identifier;
  }

  get_author(): Identity {
    return this.author;
  }

  add_version(version: Version): void {
    this.versions.push(version);
  }

  get_version(version: string): Version | null {
    const index: i32 = this.versions.findIndex((v: Version) => v['identifier'] == version);
    if(index != -1) return this.versions.at(index);
    else return null;
  }

  get_last_version(): Version {
    return this.versions.at(this.versions.length - 1);
  }

  set_comment(comment: Comment): void {
    this.comments.set(comment.get_identifier(), comment);
  }

  get_comment(identifier: string): Comment | null {
    return this.comments.get(identifier);
  }

  set_metadata(key: string, value: string): void {
    this.metadata.set(key, value);
  }

  get_metadata(key: string): string | null {
    return this.metadata.get(key);
  }
}

export const collection = new PersistentMap<string, Article>('article');