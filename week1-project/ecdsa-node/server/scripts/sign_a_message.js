const { Signature } = require('ethereum-cryptography/secp256k1');
const { toHex } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");

const firstArg = process.argv[2]
let message = "";
let privateKey = "";
if (firstArg === "--help") {
  console.log("This file is to generate a signature for a given message and private key");
  console.log("The command is `node sign_a_message.js <MESSAGE> <PRIVATE_KEY>`")
} else {
  message = process.argv[2]
  privateKey = process.argv[3]
}

async function signMessage(msg, pKey) {
  return await secp.sign(msg, pKey);
}

signMessage(message, privateKey).then((result) => { 
  console.log(`Signature: ${toHex(result)}`);
  process.exit
})
