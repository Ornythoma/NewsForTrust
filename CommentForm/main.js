


/*
import { connect, WalletConnection } from "near-api-js";
import { init } from "@textile/near-storage";


function near() {
// Defaults to Testnet: https://near.github.io/near-api-js/modules/browserconnect.html
const near = await connect({ ... });

// Need to access wallet
const wallet = new WalletConnection(near, null);
// Request to sign into your amazing near smart-contract!
await wallet.requestSignIn({ contractId: "mycontract.testnet" });

const storage = init(wallet.account());

const blob = new Blob(["Hello, world!"], { type: "text/plain" });
const file = new File([blob], "welcome.txt", {
  type: "text/plain",
  lastModified: new Date().getTime(),
});

await storage.addDeposit();

const { id, cid } = await storage.store(file);

const { request, deals } = await storage.status(id)
console.log(request.status_code)
console.log([...deals])

await wallet.signOut();
}
*/
