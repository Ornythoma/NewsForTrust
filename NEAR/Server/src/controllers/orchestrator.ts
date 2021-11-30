import config from 'config';
import { Contract } from 'near-api-js';

import { ACCOUNT, CONTRACTS, LoadAccount } from '@server/controllers/near';
import { Article, Comment } from '@server/helpers/types';

export async function InitializeNetwork(): Promise<void> {
    await LoadAccount(`${config.get('near.contracts.network.name')}.${config.get('near.contracts.network.account')}`);

    await (CONTRACTS['network'] as any).Initialize({ args: {} });
}

export async function RegisterIdentityProvider(identifier: string, contract: string): Promise<void> {
    await LoadAccount(`${config.get('near.contracts.network.name')}.${config.get('near.contracts.network.account')}`);

    await (CONTRACTS['network'] as any).AddProvider({ args: { identifier, contract } });
}

export async function InitializeRepository(network: string): Promise<void> {
    await LoadAccount(`${config.get('near.contracts.repository.name')}.${config.get('near.contracts.repository.account')}`);

    await (CONTRACTS['repository'] as any).Initialize({ args: { 'network': network } });
}

export async function AddAuthorToRepository(author: string): Promise<void> {
    await LoadAccount(`${config.get('near.contracts.repository.name')}.${config.get('near.contracts.repository.account')}`);

    await (CONTRACTS['repository'] as any).AddAuthor({ args: { 'author': author } });
}

export async function AddArticleToRepository(article: Article, author: string): Promise<void> {
    await LoadAccount(author);

    const contract_called_by_author = new Contract(
        ACCOUNT,
        `${config.get('near.contracts.repository.name')}.${config.get('near.contracts.repository.account')}`,
        config.get('near.contracts.repository.methods')
    );

    await (contract_called_by_author as any).AddArticle({ args: article });
}

export async function GetArticleFromRepository(identifier: string): Promise<Article> {
    await LoadAccount(`${config.get('near.contracts.repository.name')}.${config.get('near.contracts.repository.account')}`);

    return JSON.parse(await (CONTRACTS['repository'] as any).GetArticle({ identifier }));
}

export async function AddCommentToRepository(comment: Comment, author: string): Promise<void> {
    await LoadAccount(author);

    const contract_called_by_author = new Contract(
        ACCOUNT,
        `${config.get('near.contracts.repository.name')}.${config.get('near.contracts.repository.account')}`,
        config.get('near.contracts.repository.methods')
    );

    await (contract_called_by_author as any).AddComment({ args: comment });
}

export async function GetComment(article: string, version: string, comment: string): Promise<Comment> {
    await LoadAccount(`${config.get('near.contracts.repository.name')}.${config.get('near.contracts.repository.account')}`);

    return await (CONTRACTS['repository'] as any).GetComment({ article_identifier: article, version_identifier: version, comment_identifier: comment });
}