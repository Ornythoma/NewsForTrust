const cp = require('child_process');

const HOME_DIRECTORY = cp.execSync(`getent passwd \${SUDO_USER:-$USER} | cut -d: -f6 | tr -d '\n'`, { stdio: 'pipe' }).toString();

module.exports = {
    'env': 'development',
    'core': {
        silent: true,
        folder: `${HOME_DIRECTORY}/NewsForTrust`
    },
    'near': {
        protocol: 'http',
        host: 'localhost',
        port: 3001
    },
    'powergate': {
        protocol: 'http',
        host: 'localhost',
        port: 3002
    }
};