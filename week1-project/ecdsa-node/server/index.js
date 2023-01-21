const express = require("express");
const app = express();
const cors = require("cors");
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");
const port = 3042;

app.use(cors());
app.use(express.json());

const actors = ['zahra', 'kate', 'constance', 'martina']
const actor_key_pairs = {}
const balances = {}

function generateKeyPairs() {
  actors.forEach((item) => {
    let privateKey = toHex(secp.utils.randomPrivateKey());
    actor_key_pairs[`${item}`] = {
      'private_key': privateKey,
      'public_key': toHex(secp.getPublicKey(privateKey))
    }
  });
  return actor_key_pairs;
};
generateKeyPairs();
console.log(JSON.stringify(actor_key_pairs));

actors.forEach((actor, index) => {
  balances[actor_key_pairs[actor].public_key] = Math.trunc((100/(index + 1)));
})
console.log(JSON.stringify(balances));


app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
  return balances[address];
}

module.exports = { app, balances, setInitialBalance, generateKeyPairs, actor_key_pairs }
