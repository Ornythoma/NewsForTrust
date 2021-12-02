
# News For Trust


NewsForTrust aims to provide a platform for certifying and incentivize experts' contributions and comments on publishing platforms valuing high-quality dialogue.

Publishers joining the network are able to build expertise-defined collections of articles and allow for contributors to participate new information to them.
Whether these are from parties externally validated as experts in the field, or simply from readers voicing their takes with or without source, contributions and comments are keyed in with their writer' persona ID, and rewarded depending on a publisher-defined scheme.


Contracts are built on the NEAR Platform and allow:
- ChainedTrust to integrate new actors, Publishers and ID providers
- ID Providers to validate the real identity of an actor, linking their key to data representing their expertise field and level
- ID Providers to validate the real identity of an actor, linking their key to data representing their expertise field and level
- Collections to manage their sets of articles and corresponding comments, and value and reward contributions

## Project organisation and FILECOIN, NEAR, CLI tools codebases

_Please see the following repositories, and their respective README.md_

For Filecoin:
- the Server developed is hosted here: https://github.com/Ornythoma/NewsForTrust/tree/master/Filecoin/Server
- specifically, the controllers (main logic) are there: https://github.com/Ornythoma/NewsForTrust/tree/master/Filecoin/Server/src/controllers 

For NEAR:
- the smart contracts are here: https://github.com/Ornythoma/NewsForTrust/tree/master/NEAR/Contracts 
- the Server managing NEAR contracts, it is hosted here: https://github.com/Ornythoma/NewsForTrust/tree/master/NEAR/Server 
- specifically, the controllers (main logic) are there: https://github.com/Ornythoma/NewsForTrust/tree/master/NEAR/Server/src/controllers 
- the appropriate configuration is here: https://github.com/Ornythoma/NewsForTrust/blob/master/NEAR/Server/config/development.js 

For the CLI tool to manage the whole logic (submission of articles and comments to Filecoin (content) and NEAR (metadata)), we use:
- this repository : https://github.com/Ornythoma/NewsForTrust/tree/master/CLI .
- specifically, the logic related to the CLI is hosted in this file: https://github.com/Ornythoma/NewsForTrust/blob/master/CLI/src/controllers/cli.ts

## DEVELOPMENT 
- TypeScript
- Express.JS for REST API
- configuration (cf. configuration files + environment variables defined for that), 
- clear modularization (main entry point, controllers, ExpressJS server (including router and related routes), helpers, etc.)


## Why NEAR?

- Multichain support, which enables a whole ecosystem where identity providers and publishers may interact while being on different chains
- Design scalable-friendly and enforcement of low fees for transactions and contract calls, which is really important in this context, as articles, comments and responses are expected to be published regularly and in a consequent way
- Support for account names, which facilitates the identification of the actors of the ChainedTrust ecosystem easily, abstracting intrinsic complexity of traditional blockchain where users have to use private/public keys and long addresses
- Support of AssemblyScript in addition to Rust, which eases the integration within web applications where articles, comments and responses are expected to be submitted and verified

  
## Authors

Arbër Salihi & Emmanuel Kellner
