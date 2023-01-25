/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const { utf8ToBytes } = require('ethereum-cryptography/utils');

const { assert } = chai; // Using Assert style
const { expect } = chai; // Using Expect style
// eslint-disable-next-line no-unused-vars
const should = chai.should();
const Week1App = require('../index');

const server = Week1App.app;

describe('App Test', () => {
  const app = Week1App;

  it('adds the address if not found', () => {
    assert.equal(app.setInitialBalance('0x4'), 0);
  });

  it('sets a default balance for new addresses', () => {
    assert.equal(app.setInitialBalance('0x4'), 0);
  });

  it('get balance for address', (done) => {
    const { zahra } = app.actorKeyPairs;
    chai.request(server).get(`/balance/${zahra.public_key}`).end((err, res) => {
      res.should.have.status(200);
      res.body.balance.should.be.eq(100);
      done();
    });
  });

  it('should transfer funds from sender to receiver', async () => {
    const { kate } = app.actorKeyPairs;
    const { constance } = app.actorKeyPairs;
    const katePrivateKey = app.actorKeyPairs.kate.private_key;
    const response = await app.signMessage(utf8ToBytes(`${10}`), katePrivateKey);
    const [signature, rb] = response;
    expect(signature).to.not.equal(undefined);

    chai.request(server)
      .post('/send')
      .send({
        sender: kate.public_key, amount: 10, signature, recipient: constance.public_key, rb,
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.balance.should.be.eq(40);
      });
  });

  it('should NOT transfer if the signature does not match', async () => {
    const { kate } = app.actorKeyPairs;
    const { constance } = app.actorKeyPairs;
    const katePrivateKey = app.actorKeyPairs.kate.private_key;
    const response = await app.signMessage(utf8ToBytes(`${10}`), katePrivateKey);
    const [signature, rb] = response;
    expect(signature).to.not.equal(undefined);

    chai.request(server)
      .post('/send')
      .send({
        sender: kate.public_key, amount: 10, signature, recipient: constance.public_key, rb,
      })
      .end((err, res) => {
        res.should.have.status(400);
        err.message.should.eq("Key and Signature don't match");
      });
  });

  it('should NOT transfer if the amount makes the signature not match', async () => {
    const { kate } = app.actorKeyPairs;
    const { constance } = app.actorKeyPairs;
    const katePrivateKey = app.actorKeyPairs.kate.private_key;
    const response = await app.signMessage(utf8ToBytes(`${20}`), katePrivateKey);
    const [signature, rb] = response;
    expect(signature).to.not.equal(undefined);

    chai.request(server)
      .post('/send')
      .send({
        sender: kate.public_key, amount: 10, signature, recipient: constance.public_key, rb,
      })
      .end((err, res) => {
        res.should.have.status(400);
        err.message.should.eq("Key and Signature don't match");
      });
  });

  it('should generate actor keypairs', () => {
    expect(app.generateKeyPairs().zahra.public_key).to.not.equal(null);
  });
});
