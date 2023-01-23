/* eslint-disable no-console */
const express = require('express');

const app = express();
const cors = require('cors');
const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');

const port = 3042;
const { utf8ToBytes } = require('ethereum-cryptography/utils');

app.use(cors());
app.use(express.json());

const actors = ['zahra', 'kate', 'constance', 'martina'];
const actorKeyPairs = {};
const balances = {};

function generateKeyPairs() {
  actors.forEach((item) => {
    const privateKey = toHex(secp.utils.randomPrivateKey());
    actorKeyPairs[`${item}`] = {
      private_key: privateKey,
      public_key: toHex(secp.getPublicKey(privateKey)),
    };
  });
  return actorKeyPairs;
}
generateKeyPairs();
// eslint-disable-next-line no-console
console.log(JSON.stringify(actorKeyPairs));

actors.forEach((actor, index) => {
  balances[actorKeyPairs[actor].public_key] = Math.trunc((100 / (index + 1)));
});

async function signMessage(msg, privateKey) {
  return secp.sign(msg, privateKey, { recovered: true });
}

async function recoverKey(message, signature, recoveryBit) {
  return secp.recoverPublicKey(message, signature, recoveryBit);
}

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
  return balances[address];
}

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', async (req, res) => {
  const {
    sender, recipient, amount, signature, rb,
  } = req.body;
  console.log(`Sender: ${sender}`);
  console.log(`Recpient: ${recipient}`);
  console.log(`Amount: ${amount}`);
  console.log(`Signature: ${signature}`);
  console.log(`RB: ${rb}`);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const messageInBytes = utf8ToBytes(`${amount}`);

  let publicKeyFromSenderSig = '';
  await recoverKey(messageInBytes, signature, Number(rb)).then((result) => {
    publicKeyFromSenderSig = toHex(result);
    return publicKeyFromSenderSig;
  });

  console.log(publicKeyFromSenderSig);

  if (sender !== publicKeyFromSenderSig) {
    res.status(400).send({ message: "Key and Signature don't match" });
  }
  console.log('made it past');

  if (balances[sender] < amount) {
    res.status(400).send({ message: 'Not enough funds!' });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}!`);
});

module.exports = {
  app, balances, setInitialBalance, generateKeyPairs, actorKeyPairs, signMessage,
};
