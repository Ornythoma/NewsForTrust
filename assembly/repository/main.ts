import { context, ContractPromiseBatch, ContractPromiseResult, logging, storage, u128 } from 'near-sdk-core';
import { PersistentSet, ContractPromise } from 'near-sdk-as';

import { Article, collection, Comment, CommentType, Identity, Response, Version } from './model';

export const authors = new PersistentSet<string>('author');

export function Initialize(network: string): void {
  if (!_VerifyInitialization()) {
    storage.set('administrator', context.sender);
    storage.set('network', network);
  }
}

export function ChangeAdministrator(new_administrator: string): void {
  if (_VerifyAdministrator()) {
    storage.set('administrator', new_administrator);
  }
}

export function ChangeNetwork(network: string): void {
  if (_VerifyAdministrator()) {
    storage.set('network', network);
  }
}

export function AddAuthor(author: string): void {
  if (_VerifyAdministrator()) {
    authors.add(author);
  }
}

export function RemoveAuthor(author: string): void {
  authors.delete(author);
}

export function AddArticle(identifier: string, initial_version: string, signature: string, provider: string): bool {
  if (!_VerifyAuthor()) return false;

  const author: Identity = new Identity(provider, context.sender);
  const version: Version = new Version(identifier, initial_version, signature);
  const article: Article = new Article(identifier, author, version);
  collection.set(identifier, article);
  return true;
}

export function GetArticle(identifier: string): Article | null {
  return collection.get(identifier);
}

export function AddMetadataToArticle(article_identifier: string, key: string, value: string): void {
  if(_VerifyAdministrator()) {
    const article: Article | null = collection.get(article_identifier);
    if(article) article.set_metadata(key, value);
  }
}

export function GetMetadataFromArticle(article_identifier: string, key: string): string | null {
  if(_VerifyAdministrator()) {
    const article: Article | null = collection.get(article_identifier)!;
    if(article) return article.get_metadata(key);
    else return null;
  } else return null;
}

export function AddVersion(article_identifier: string, version_identifier: string, version_name: string, signature: string): bool {
  if (collection.contains(article_identifier)) return false;

  const article: Article = collection.get(article_identifier)!;
  if (article.get_author().get_identifier() !== context.sender) return false;

  const version: Version = new Version(version_identifier, version_name, signature);
  article.add_version(version);
  return true;
}

export function AddComment(article_identifier: string, version_identifier: string, comment_identifier: string, signature: string, provider: string, type: CommentType): bool {
  if (!collection.contains(article_identifier)) return false;

  // TODO: Handle eligibility
  // _VerifyContributorEligibility(provider);

  const author: Identity = new Identity(provider, context.sender);
  const comment: Comment = new Comment(comment_identifier, version_identifier, author, signature, type);
  const article: Article = collection.get(article_identifier)!;
  article.set_comment(comment);
  // In reality, how much we send here would depends on several factors (type and quality of the review, profile of the author of the comment, etc.)
  ContractPromiseBatch.create(context.sender).transfer(u128.from(10));
  return true;
}

export function GetComment(article_identifier: string, comment_identifier: string): Comment | null {
  const article: Article | null = collection.get(article_identifier);
  if(article) {
    return article.get_comment(comment_identifier);
  } else {
    return null;
  }
}

export function AddMetadataToComment(article_identifier: string, comment_identifier: string, key: string, value: string): void {
  if(_VerifyAdministrator()) {
    const article: Article | null = collection.get(article_identifier);
    if(article) {
      const comment: Comment | null = article.get_comment(comment_identifier);
      if(comment) comment.set_metadata(key, value);
    }
  }
}

export function GetMetadataFromComment(article_identifier: string, comment_identifier: string, key: string): string | null {
  if(_VerifyAdministrator()) {
    const article: Article | null = collection.get(article_identifier)!;
    if(article) {
      const comment: Comment | null = article.get_comment(comment_identifier);
      if(comment) return comment.get_metadata(key);
      else return null;
    }
    else return null;
  } else return null;
}

export function AddResponse(article_identifier: string, comment_identifier: string, response_identifier: string, signature: string, provider: string): bool {
  if(!collection.contains(article_identifier)) return false;

  // TODO: Handle eligibility
  // _VerifyContributorEligibility(provider);

  const article: Article = collection.get(article_identifier)!;
  const author: Identity = new Identity(provider, context.sender);
  const comment: Comment | null = article.get_comment(comment_identifier);
  
  if(comment) {
    const response: Response = new Response(response_identifier, author, signature);
    comment.add_response(response);
    // In reality, how much we send here would depends on several factors (type and quality of the review, profile of the author of the comment, etc.)
  ContractPromiseBatch.create(context.sender).transfer(u128.from(10));
  }
  
  return true;
}

export function GetResponse(article_identifier: string, comment_identifier: string, response_identifier: string): Response | null {
  const article: Article | null = collection.get(article_identifier);
  if(article) {
    const comment: Comment | null = article.get_comment(comment_identifier);
    if(comment) {
      return comment.get_response(response_identifier);
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export function AddMetadataToResponse(article_identifier: string, comment_identifier: string, response_identifier: string, key: string, value: string): void {
  if(_VerifyAdministrator()) {
    const article: Article | null = collection.get(article_identifier);
    if(article) {
      const comment: Comment | null = article.get_comment(comment_identifier);
      if(comment) {
        const response: Response | null = comment.get_response(response_identifier);
        if(response) response.set_metadata(key, value);
      }
    }
  }
}

export function GetMetadataFromResponse(article_identifier: string, comment_identifier: string, response_identifier: string, key: string): string | null {
  if(_VerifyAdministrator()) {
    const article: Article | null = collection.get(article_identifier)!;
    if(article) {
      const comment: Comment | null = article.get_comment(comment_identifier);
      if(comment) {
        const response: Response | null = comment.get_response(response_identifier);
        if(response) return response.get_metadata(key);
        else return null;
      }
      else return null;
    }
    else return null;
  } else return null;
}

function _VerifyInitialization(): bool {
  return storage.hasKey('administrator') && storage.hasKey('network');
}

function _VerifyAdministrator(): bool {
  return storage.get<string>('administrator') == context.sender;
}

function _VerifyAuthor(): bool {
  return authors.has(context.sender);
}

function _VerifyContributorEligibility(provider: string): void {
  const promise = ContractPromise.create<string>(storage.get<string>('network') as string, 'RetrieveProvider', provider, 300000000000000, u128.Zero);
  const verification_of_identity = promise.then<string>(context.contractName, '_VerifyIdentity', context.sender, 300000000000000);
  verification_of_identity.returnAsResult();
}

function _VerifyIdentity(identity: string): void {
  const results: ContractPromiseResult[] = ContractPromise.getResults();
  const promise = ContractPromise.create<string>(results[0].buffer.toString(), 'VerifyIdentityExistence', identity, 300000000000000, u128.Zero);
  const verification_of_identity = promise.then<null>(context.contractName, '_ValidateResponse', null, 300000000000000);
  verification_of_identity.returnAsResult();
}

function _ValidateResponse(): void {
  const results: ContractPromiseResult[] = ContractPromise.getResults();
  if (bool(results[0].buffer.toString()) == false) throw new Error('Invalid identity');
}