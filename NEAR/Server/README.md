# Server

## Table of Contents

-   [Build](#build)
-   [Deploy](#deploy)
-   [Configuration](#configuration)
-   [Endpoints](#endpoints)
-   [License](#license)

## Build

To build this server, install npm packages:
```bash
$ npm install
```

Then start this script:
```bash
$ npm run build
```

## Deploy

For the first run, you should configure the tool appropriately and set the __deployment__ variable to *true* (see [Configuration](#configuration)).

Deployment of the server is done as follow:
```bash
$ npm install && npm run deploy
```

## Endpoints
Available endpoints are described below.

```bash
$ GET http://<host>:<port>/articles/:identifier
```
(where :identifier is the unique identifier of the article hosted on Filecoin)

```bash
$ POST http://<host>:<port>/articles
```
(where the submitted data are valid article metada, as per the model of the *repository* smart contract (see __Contracts__ folder))

```bash
$ GET http://<host>:<port>/articles/:article/version/:version/comments/:comment
```
(where :article is the unique identifier of the article hosted on Filecoin, :version the version of the article for which the comment should be added, and :comment the unique identifier of the comment hosted on Filecoin)

```bash
$ POST http://<host>:<port>/articles/:article/version/:version/comments
```
(with the same remarks as for the previous call, and the submitted data being valid comment metada, as per the model of the *repository* smart contract (see __Contracts__ folder))

## Configuration

A configuration file is available in __config/development.js__. Here, you can specify information about the NEAR blockchain and about the server.

For NEAR (*near* object of the configuration file):
- *network* is the network to use (by default, testnet)
- *credentials* is the folder where the keypairs of the keystore are hosted
- *deployment* should be *true* only during the initialization (i.e. when smart contracts should be deployed), otherwise the variable should be *false*
- endpoints are the different endpoints to use for the connection, as per NEAR documentation
- *accounts* is the list of accounts to use for the demonstration (each account having at least an *account* property referencing the address of the account, and a *private_key* related to this account)
- *contracts* is the set of contracts to deploy and use (*base* refers to where they are hosted, and each contract defines its own *file* (related to the base), its *name*, the *account* owning it, and the *methods* that it exposes)

## License

[MIT](LICENSE)
