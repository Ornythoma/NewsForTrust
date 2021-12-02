
# News For Trust


NewsForTrust aims to provide a platform for certifying and incentivize experts' contributions and comments on publishing platforms valuing high-quality dialogue.

Publishers joining the network are able to build expertise-defined collections of articles and allow for contributors to participate new information to them.
Whether these are from parties externally validated as experts in the field, or simply from readers voicing their takes with or without source, contributions and comments are keyed in with their writer' persona ID, and rewarded depending on a publisher-defined scheme.


Contracts are built on the NEAR Platform and allow:
- ChainedTrust to integrate new actors, Publishers and ID providers
- ID Providers to validate the real identity of an actor, linking their key to data representing their expertise field and level
- ID Providers to validate the real identity of an actor, linking their key to data representing their expertise field and level
- Collections to manage their sets of articles and corresponding comments, and value and reward contributions



## For FILECOIN, NEAR codebases and CLI tools
  
For Filecoin, the Server developed is hosted here: https://github.com/Ornythoma/NewsForTrust/tree/master/Filecoin/Server
Especially, the controllers (main logic) are there: https://github.com/Ornythoma/NewsForTrust/tree/master/Filecoin/Server/src/controllers

For NEAR, the smart contracts are here: https://github.com/Ornythoma/NewsForTrust/tree/master/NEAR/Contracts
For the Server managing NEAR contracts, it is hosted here: https://github.com/Ornythoma/NewsForTrust/tree/master/NEAR/Server
Especially, the controllers (main logic) are there: https://github.com/Ornythoma/NewsForTrust/tree/master/NEAR/Server/src/controllers
With the appropriate configuration here: https://github.com/Ornythoma/NewsForTrust/blob/master/NEAR/Server/config/development.js

For the CLI tool to manage the whole logic (submission of articles and comments to Filecoin (content) and NEAR (metadata)), we use this repository: https://github.com/Ornythoma/NewsForTrust/tree/master/CLI
Especially, the logic related to the CLI is hosted in this file: https://github.com/Ornythoma/NewsForTrust/blob/master/CLI/src/controllers/cli.ts

=> DEVELOPMENT in TypeScript, Express.JS for REST API, configuration (cf. configuration files + environment variables defined for that), clear modularization (main entry point, controllers, ExpressJS server (including router and related routes), helpers, etc.)


  

## Why NEAR?

- Multichain support, which enables a whole ecosystem where identity providers and publishers may interact while being on different chains
- Design scalable-friendly and enforcement of low fees for transactions and contract calls, which is really important in this context, as articles, comments and responses are expected to be published regularly and in a consequent way
- Support for account names, which facilitates the identification of the actors of the ChainedTrust ecosystem easily, abstracting intrinsic complexity of traditional blockchain where users have to use private/public keys and long addresses
- Support of AssemblyScript in addition to Rust, which eases the integration within web applications where articles, comments and responses are expected to be submitted and verified




## Demonstrator
  


In this Proof of Concept, we used four distinct smart contracts:

- one for the network, i.e. the ecosystem gathering all the actors participating in the ChainedTrust program;

- one for the identity providers, i.e. organizations responsible of proving that identities exist and have some roles and/or credentials attached to them to other interested parties;

- and two contracts for the repositories hosting the set of articles being published, and comments/responses to comments related to those articles.

  

We have so deployed all the contracts on the Testnet of Near, after having compiled them:

asb main.ts && near dev-deploy

  

We registered an identity provider to the network for the sake of the example.

  

When an author publishes an article, he will have the opportunity to compute a fingerprint based on some metadata of such article. This fingerprint will be used to store a reference to the article being published.

  

Later, people may add comments to articles. The procedure is similar to articles: we compute metadata associated to the comment being published and add the related fingerprint in the smart contract managing articles. Doing so, people gets reward in a decentralized way, as shown in the transaction depicting the creation of a comment in the smart contract.

  

At any time, we can query the smart contracts to, e.g., fetch articles, comments, etc.

  

## Authors

Arbër Salihi & Emmanuel Kellner
