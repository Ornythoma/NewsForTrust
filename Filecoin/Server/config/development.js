module.exports = {
    'env': 'development',
    'core': {
        'silent': true
    },
    'powergate': {
        protocol: 'http',
        host: '0.0.0.0',
        port: 6002
    },
    'server': {
        protocol: 'http',
        host: 'localhost',
        port: 3002,
        authorized_clients: []
    }
};