import { Answers, DistinctChoice, ListChoiceMap } from "inquirer";

export let QUIT_COMMAND: string = 'exit';

export let DEFAULT_COMMAND: string = 'exit';
export  let ALL_COMMANDS: DistinctChoice<ListChoiceMap<Answers>>[] = [
    {
        name: 'Manage articles',
        value: 'manage_articles'
    },
    {
        name: 'Manage comments',
        value: 'manage_comments'
    },
    {
        name: 'Exit',
        value: QUIT_COMMAND
    }
];

export let DEFAULT_OPERATION: string = 'show_main_menu';
export  let ALL_OPERATIONS = (element: 'article' | 'comment'): DistinctChoice<ListChoiceMap<Answers>>[] => [
    {
        name: `Create ${ element }`,
        value: `create_${ element }`
    },
    {
        name: `Fetch ${ element }`,
        value: `fetch_${ element }`
    },
    {
        name: 'Return to main menu',
        value: 'show_main_menu'
    },
    {
        name: 'Exit',
        value: QUIT_COMMAND
    }
];