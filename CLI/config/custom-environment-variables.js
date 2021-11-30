module.exports = {
    'core': {
        silent: 'CORE_SILENT_EXECUTION_MODE'
    },
    'near': {
        network: 'NEAR_NETWORK',
        credentials: 'NEAR_CREDENTIALS_FOLDER',
        deployment: 'NEAR_DEPLOYMENT',
        endpoints: {
            node: 'NEAR_ENDPOINTS_NODE',
            wallet: 'NEAR_ENDPOINTS_WALLET',
            helper: 'NEAR_ENDPOINTS_HELPER'
        },
        private_key: 'NEAR_PRIVATE_KEY',
        accounts: {
            provider: {
                name: 'NEAR_PROVIDER_NAME',
                account: 'NEAR_PROVIDER_ACCOUNT',
                private_key: 'NEAR_PROVIDER_PRIVATE_KEY'
            },
            publisher: {
                account: 'NEAR_PUBLISHER_ACCOUNT',
                private_key: 'NEAR_PUBLISHER_PRIVATE_KEY'
            },
            journalist: {
                account: 'NEAR_JOURNALIST_ACCOUNT',
                private_key: 'NEAR_JOURNALIST_PRIVATE_KEY'
            },
            commenter: {
                account: 'NEAR_COMMENTER_ACCOUNT',
                private_key: 'NEAR_COMMENTER_PRIVATE_KEY'
            },
            network: {
                account: 'NEAR_NETWORK_ACCOUNT',
                private_key: 'NEAR_NETWORK_PRIVATE_KEY'
            }
        },
        contracts: {
            base: 'NEAR_CONTRACTS_BASE_FOLDER',
            provider: {
                file: 'NEAR_PROVIDER_CONTRACT_FILE',
                name: 'NEAR_PROVIDER_CONTRACT_NAME',
                account: 'NEAR_PROVIDER_CONTRACT_PARENT'
            },
            repository: {
                file: 'NEAR_REPOSITORY_CONTRACT_FILE',
                name: 'NEAR_REPOSITORY_CONTRACT_NAME',
                account: 'NEAR_REPOSITORY_CONTRACT_PARENT'
            },
            network: {
                file: 'NEAR_NETWORK_CONTRACT_FILE',
                name: 'NEAR_NETWORK_CONTRACT_NAME',
                account: 'NEAR_NETWORK_CONTRACT_PARENT'
            }
        }
    },
    'server': {
        protocol: 'SERVER_PROTOCOL',
        host: 'SERVER_HOST',
        port: 'SERVER_PORT'
    }
};