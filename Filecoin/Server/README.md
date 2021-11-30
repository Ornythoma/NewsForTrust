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

You should first run a local network of Filecoin. This can be done by executing, from the __powergate__ folder:
```bash
$ make localnet
```

Then, deploy the server:
```bash
$ npm install && npm run deploy
```

## Endpoints
Two main endpoints are available.

The first one is:
```bash
$ GET http://<host>:port>/data/:cid
```
(where :cid is the unique identifier of the content hosted on Filecoin)

The second one is:
```bash
$ POST http://<host>:port>/data
```
(where the submitted data as part of the HTTP request is the content to be hosted on Filecoin)

## Configuration

A configuration file is available in __config/development.js__. Here, you can specify the endpoint used to connect to Powergate, itself connected to your Filecoin network running locally.

It is also possible to specify the endpoint of the server.

## License

[MIT](LICENSE)
