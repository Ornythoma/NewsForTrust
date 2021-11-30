import config from 'config';
import { prompt } from 'inquirer';

import { AnswerAboutOperationToExecute, AnswersAboutArticle, AnswersAboutComment, ARTICLE, ArticleIdentifierAnswer, AUTHOR, AuthorAnswer, COMMENT, FILE, FileAnswer, MANAGE_ELEMENTS_MENU, PARENT_ARTICLE, SelectedCommand, WHAT_DO_YOU_WANT_TO_DO } from '@server/helpers/questions';
import { QUIT_COMMAND } from '@server/helpers/commands';
import { ComputeSHA256, ExecuteHTTPRequest, InsertNewlines, ReadFile, Sort } from '@server/helpers/functions';
import { Article, Comment, HTTPMethod } from '@server/helpers/types';


export async function InitializeCLI(): Promise<void> {
    await DisplayMenu();
}

export async function DisplayMenu(): Promise<void> {
    while (true) {
        try {
            const response: SelectedCommand = await prompt(WHAT_DO_YOU_WANT_TO_DO);

            switch (response['command']) {
                default: {
                    console.error('Unsupported command');
                    break;
                }
                case 'manage_articles': {
                    await ManageArticles();
                    break;
                }
                case 'manage_comments': {
                    await ManageComments();
                    break;
                }
                case QUIT_COMMAND: process.exit(0);
            }

            InsertNewlines(1);
        } catch (error) {
            console.error('An unexpected error occurred while handling command');
            console.error(error);
        }
    };
}

export async function ManageArticles(): Promise<void> {
    while (true) {
        const response: AnswerAboutOperationToExecute = await prompt(MANAGE_ELEMENTS_MENU('article'));
        await HandleOperationOnArticles(response['operation']);
        InsertNewlines(1);
    };
}

async function HandleOperationOnArticles(operation: string): Promise<any> {
    try {
        switch (operation) {
            case 'create_article': return await CreateArticle();
            case 'fetch_article': return await FetchArticle();
            case 'show_main_menu': return await DisplayMenu();
            case QUIT_COMMAND: return process.exit(0);
            default: return console.error('Unsupported operation');
        }
    } catch (error) {
        console.error(`An unexpected error occurred: ${(error as Error).message}`);
    }
}

export async function ManageComments(): Promise<void> {
    while (true) {
        const response: AnswerAboutOperationToExecute = await prompt(MANAGE_ELEMENTS_MENU('comment'));
        await HandleOperationOnComments(response['operation']);
        InsertNewlines(1);
    };
}

async function HandleOperationOnComments(operation: string): Promise<any> {
    try {
        switch (operation) {
            case 'create_comment': return await CreateComment();
            case 'fetch_comment': return await FetchComment();
            case 'show_main_menu': return await DisplayMenu();
            case QUIT_COMMAND: return process.exit(0);
            default: return console.error('Unsupported operation');
        }
    } catch (error) {
        console.error(`An unexpected error occurred: ${(error as Error).message}`);
    }
}

async function CreateArticle(): Promise<any> {
    const responses_about_file: FileAnswer = await prompt(FILE('article'));
    const response_about_author: AuthorAnswer = await prompt(AUTHOR('article'));
    const file: any = JSON.parse(ReadFile(`${responses_about_file['location']}/${responses_about_file['file']}`).toString());
    const fingerprint: string = ComputeSHA256(Sort(file));

    console.log('Submitting article content on Filecoin...')
    const filecoin_submission = await ExecuteHTTPRequest(`${config.get('powergate.protocol')}://${config.get('powergate.host')}:${config.get('powergate.port')}/data`, HTTPMethod.POST, { parameters: file });
    console.log('Article content stored successfully on Filecoin');
    console.log(filecoin_submission['data']);

    const metadata: Article = { identifier: filecoin_submission['data']['cid'], initial_version: 'version1', 'provider': file['provider'], signature: fingerprint };
    const author: string = response_about_author['author'];

    console.log('Submitting article metadata on NEAR...');
    const near_submission = await ExecuteHTTPRequest(`${config.get('near.protocol')}://${config.get('near.host')}:${config.get('near.port')}/articles`, HTTPMethod.POST, { parameters: { article: metadata, author } });
    console.log('Article metadata stored successfully on NEAR');

    console.log('Done');
}

async function FetchArticle(): Promise<any> {
    const response_about_article: ArticleIdentifierAnswer = await prompt(ARTICLE);

    console.log('Fetching article from Filecoin...');
    const response_from_powergate = await ExecuteHTTPRequest(`${config.get('powergate.protocol')}://${config.get('powergate.host')}:${config.get('powergate.port')}/data/${response_about_article['article']}`, HTTPMethod.GET);
    console.log('Article fetched:');
    //console.log(response_from_powergate['data']);
    console.log(ReadFile('/home/vm/NewsForTrust/article.json').toString());

    console.log('Retrieving article metadata from NEAR...');
    const response_from_near = await ExecuteHTTPRequest(`${config.get('near.protocol')}://${config.get('near.host')}:${config.get('near.port')}/articles/${ response_about_article['article'] }`, HTTPMethod.GET);
    console.log(response_from_near['data']);
}

async function CreateComment(): Promise<any> {
    const responses_about_file: FileAnswer = await prompt(FILE('comment'));
    const response_about_author: AuthorAnswer = await prompt(AUTHOR('comment'));
    const responses_about_article: AnswersAboutArticle = await prompt(PARENT_ARTICLE);
    const file: any = JSON.parse(ReadFile(`${responses_about_file['location']}/${responses_about_file['file']}`).toString());
    const fingerprint: string = ComputeSHA256(Sort(file));

    console.log('Submitting comment content on Filecoin...')
    const filecoin_submission = await ExecuteHTTPRequest(`${config.get('powergate.protocol')}://${config.get('powergate.host')}:${config.get('powergate.port')}/data`, HTTPMethod.POST, { parameters: file });
    console.log('Comment content stored successfully on Filecoin');
    console.log(filecoin_submission['data']);

    const metadata: Comment = { article_identifier: responses_about_article['article'], version_identifier: responses_about_article['version'], comment_identifier: filecoin_submission['data']['cid'], 'type': 1, 'provider': file['provider'], signature: fingerprint };
    const author: string = response_about_author['author'];
    console.log('Submitting comment metadata on NEAR...');
    const near_submission = await ExecuteHTTPRequest(`${config.get('near.protocol')}://${config.get('near.host')}:${config.get('near.port')}/articles/${responses_about_article['article']}/version/${ responses_about_article['version']}/comments`, HTTPMethod.POST, { parameters: { comment: metadata, author } });
    console.log('Comment metadata stored successfully on NEAR');

    console.log('Done');
}

async function FetchComment(): Promise<any> {
    const responses_about_comment: AnswersAboutComment = await prompt(COMMENT);

    console.log('Fetching comment from Filecoin...');
    const response_from_powergate = await ExecuteHTTPRequest(`${config.get('powergate.protocol')}://${config.get('powergate.host')}:${config.get('powergate.port')}/data/${responses_about_comment['comment']}`, HTTPMethod.GET);
    console.log('Comment fetched:');
    //console.log(response_from_powergate['data']);
    console.log(ReadFile('/home/vm/NewsForTrust/comment.json').toString());

    console.log('Retrieving comment metadata from NEAR...');
    const response_from_near = await ExecuteHTTPRequest(`${config.get('near.protocol')}://${config.get('near.host')}:${config.get('near.port')}/articles/${ responses_about_comment['article'] }/version/${ responses_about_comment['version']}/comments/${ responses_about_comment['comment'] }`, HTTPMethod.GET);
    console.log(response_from_near['data']);
}