const cp = require('child_process');

const HOME_DIRECTORY = cp.execSync(`getent passwd \${SUDO_USER:-$USER} | cut -d: -f6 | tr -d '\n'`, { stdio: 'pipe' }).toString();

module.exports = {
    'env': 'development',
    'core': {
        silent: true
    },
    'near': {
        network: 'testnet',
        credentials: `${ HOME_DIRECTORY }/.near-credentials`,
        deployment: true,
        endpoints: {
            node: 'https://rpc.testnet.near.org',
            wallet: 'https://wallet.testnet.near.org',
            helper: 'https://helper.testnet.near.org'
        },
        accounts: {
            provider: {
                name: 'Geneva University Hospitals',
                account: 'geneva-university-hospitals.testnet',
                private_key: '3fySBSGw3QQxTMQ3gjP6aGcZAzbv8Qc2xHjKwUci1gh28egjUMmpjD5VU8tU9iU8gkZu7WKka833sQhos4KhYd6q'
            },
            publisher: {
                account: 'news-publisher.testnet',
                private_key: '64j1A6zm4SB22kRvsePTkGbeK8J3RFXBbU45KqDZYkaxr7SyLTsrsktYY8hL68ieuWqQQnbgZyrvNgfgtxvd9QZF'
            },
            journalist: {
                account: 'encode-journalist.testnet',
                private_key: '5zJU2CKckiZcCVMyDfvaTMHDr62N3gF6vMnAb5g2Jyt9RvP7C88PNYuShJj8rwA11HXjVbYFEYqaZRJvXYVmFRya'
            },
            commenter: {
                account: 'encode-commenter.testnet',
                private_key: '235a3QWWvxQFqfg9XGBCrA8HDnGmDdvASwk54GJmbGii9R5MDJAJEq9E8rcBWrboVQvzDMasuP1KVJhsLyJauP7E'
            },
            network: {        
                account: 'encode2021.testnet',
                private_key: 'RcSyYQ9tvEbdqGAHa3PrKAJaqM8MaDCmbKH89ZbhhjLh7xGeezzobfm2uX4Fm5V5xh4Bb13ijgPYoeJrGChqAdt'
            }
        },
        contracts: {
            base: `${ HOME_DIRECTORY }/NEAR/Contracts/assembly`,
            provider: {
                file: 'identity-provider/out/main.wasm',
                name: 'id-doctors-v2',
                account: 'geneva-university-hospitals.testnet',
                methods: {
                    viewMethods: ['RetrieveIdentity', 'GetMetadata', 'GetRole'],
                    changeMethods: ['Initialize', 'ChangeProvider', 'AddIdentity', 'VerifyIdentity', 'AddMetadata', 'AddRole']
                }
            },
            repository: {
                file: 'repository/out/main.wasm',
                name: 'repository-v2',
                account: 'news-publisher.testnet',
                methods: {
                    viewMethods: ['GetArticle', 'GetMetadataFromArticle', 'GetComment', 'GetMetadataFromComment', 'GetResponse', 'GetMetadataFromResponse'],
                    changeMethods: ['Initialize', 'ChangeAdministrator', 'ChangeNetwork', 'AddAuthor', 'RemoveAuthor', 'AddArticle', 'AddMetadataToArticle', 'AddVersion', 'AddComment', 'AddMetadataToComment', 'AddResponse', 'AddMetadataToResponse']
                }
            },
            network: {
                file: 'network/out/main.wasm',
                name: 'network-v2',
                account: 'encode2021.testnet',
                methods: {
                    viewMethods: ['RetrievePublisher', 'RetrieveProvider', 'GetMetadata'],
                    changeMethods: ['Initialize', 'ChangeOwner', 'AddPublisher', 'AddProvider', 'VerifyIdentity', 'AddMetadata']
                }
            }
        }
    },
    'server': {
        protocol: 'http',
        host: 'localhost',
        port: 3001,
        authorized_clients: []
    }
};