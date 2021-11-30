import config from 'config';
import { QuestionCollection } from 'inquirer';

import { DEFAULT_COMMAND, ALL_COMMANDS, DEFAULT_OPERATION, ALL_OPERATIONS } from '@server/helpers/commands';


export type SelectedCommand = Record<'command', string>;
export const WHAT_DO_YOU_WANT_TO_DO: QuestionCollection<SelectedCommand>[] = [
    {
        type: 'list',
        name: 'command',
        message: 'What do you want to do?',
        default: DEFAULT_COMMAND,
        choices: ALL_COMMANDS,
        pageSize: 8
    }
];

export type AnswerAboutOperationToExecute = Record<'operation', string>;
export const MANAGE_ELEMENTS_MENU = (element: 'article' | 'comment'): QuestionCollection<AnswerAboutOperationToExecute>[] => [
    {
        type: 'list',
        name: 'operation',
        message: 'What do you want to do?',
        default: DEFAULT_OPERATION,
        choices: ALL_OPERATIONS(element),
        pageSize: 5
    }
];

export type FileAnswer = Record<'file', string> & Record<'location', string>;
export const FILE: (element: 'article' | 'comment') => QuestionCollection<FileAnswer>[] = (element: 'article' | 'comment'): QuestionCollection<FileAnswer>[] => [
  {
    type: 'input',
    name: 'file',
    message: `File containing the ${element} to submit:`,
    default: `${element}.json`,
    validate: (value: string) => { return value ? true : 'Please enter the name of the JSON file' }
  },
  {
    type: 'input',
    name: 'location',
    message: 'Location of the file:',
    default: `${config.get('core.folder')}`,
    validate: (value: string) => { return value ? true : 'Please enter the full path to the file' }
  }
];

export type AuthorAnswer = Record<'author', string>;
export const AUTHOR: (element: 'article' | 'comment') => QuestionCollection<AuthorAnswer>[] = (element: 'article' | 'comment'): QuestionCollection<AuthorAnswer>[] => [
  {
    type: 'input',
    name: 'author',
    message: `Author of the ${element}:`,
    default: `encode-${ (element === 'article') ? 'journalist' : 'commenter'}.testnet`,
    validate: (value: string) => { return value ? true : 'Please enter the account of the author' }
  }
];

export type AnswersAboutArticle = Record<'article', string> & Record<'version', string>;
export const PARENT_ARTICLE: QuestionCollection<AnswersAboutArticle>[] = [
  {
    type: 'input',
    name: 'article',
    message: `Parent article identifier:`,
    validate: (value: string) => { return value ? true : 'Please enter the parent article identifier' }
  },
  {
    type: 'input',
    name: 'version',
    message: `Article version:`,
    default: 'version1',
    validate: (value: string) => { return value ? true : 'Please enter the article version' }
  }
];

export type ArticleIdentifierAnswer = Record<'article', string>;
export const ARTICLE: QuestionCollection<ArticleIdentifierAnswer>[] = [
  {
    type: 'input',
    name: 'article',
    message: `Article identifier:`,
    validate: (value: string) => { return value ? true : 'Please enter the article identifier' }
  }
];

export type AnswersAboutComment = Record<'article', string> & Record<'version', string> & Record<'comment', string>;
export const COMMENT: QuestionCollection<AnswersAboutComment>[] = [
  {
    type: 'input',
    name: 'article',
    message: `Article identifier:`,
    validate: (value: string) => { return value ? true : 'Please enter the article identifier' }
  },
  {
    type: 'input',
    name: 'version',
    message: `Article version:`,
    default: 'version1',
    validate: (value: string) => { return value ? true : 'Please enter the article version' }
  },
  {
    type: 'input',
    name: 'comment',
    message: `Comment identifier:`,
    validate: (value: string) => { return value ? true : 'Please enter the comment identifier' }
  }
];