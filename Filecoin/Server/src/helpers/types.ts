export type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };
export type ExecutionOptions = { silent: boolean, critical: boolean };
export type Failure = { success: false, errors?: string[] };
export type Success<T> = { success: true, response: T };
export type Response<T> = Failure | Success<T>;