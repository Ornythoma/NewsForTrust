# Server

## Table of Contents
-   [Description](#description)
-   [Build](#build)
-   [Deploy](#deploy)
-   [License](#license)

## Description

The internal and public functions of each smart contract are defined in the __main.ts__ file.
The __model.ts__ file is used to specify the model of the objects being manipulated by the smart contracts.
The __out__ folder is where the compiled file is saved.

## Build

To build each contract manually, you should first install AssemblyScript tool, e.g., globally:
```bash
$ npm install -g asbuild
```

Then, for each smart contract, run:
```bash
asb main.ts
```

## Deploy

The smart contracts are deployed setting the *deployment* configuration property to *true* and deploying the server.
To manually deploy contracts using NEAR CLI (and assuming CLI is installed, as per NEAR official documentation), you can run:
```bash
near dev-deploy
```

Or for production deployment:
```bash
near deploy
```

## License

[MIT](LICENSE)
