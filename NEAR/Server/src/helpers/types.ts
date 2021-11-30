export type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };
export type ExecutionOptions = { silent: boolean, critical: boolean };
export type Failure = { success: false, errors?: string[] };
export type Success<T> = { success: true, response: T };
export type Response<T> = Failure | Success<T>;

export type Article = { 'identifier': string, 'initial_version': string, 'signature': string, 'provider': string };
export type Comment = { 'article_identifier': string, 'version_identifier': string, 'comment_identifier': string, 'type': number, 'signature': string, 'provider': string };