/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
const { toHex } = require('ethereum-cryptography/utils');
const secp = require('ethereum-cryptography/secp256k1');
const { utf8ToBytes } = require('ethereum-cryptography/utils');

const firstArg = process.argv[2];
let message = '';
let privateKey = '';

if (firstArg === '--help') {
  console.log('This file is to generate a signature for a given message and private key');
  console.log('The command is `node sign_a_message.js <MESSAGE> <PRIVATE_KEY>`');
} else {
  message = process.argv[2];
  privateKey = process.argv[3];
}

async function signMessage(msg, pKey) {
  return secp.sign(utf8ToBytes(msg), pKey, { recovered: true });
}

signMessage(message, privateKey).then((result) => {
  [signature, rb] = result;
  console.log(`Signature: ${toHex(signature)}`);
  console.log(`RecoveryBit: ${rb}`);
  // eslint-disable-next-line no-unused-expressions
  process.exit;
});
