let chai = require('chai');  
let chaiHttp = require('chai-http');
const { Signature } = require('ethereum-cryptography/secp256k1');
chai.use(chaiHttp);
const secp = require("ethereum-cryptography/secp256k1");

let assert = chai.assert;    // Using Assert style
let expect = chai.expect;    // Using Expect style
let should = chai.should();
const Week1App = require('../index');
const server = Week1App.app;


describe('App Test', () => {
  let app = Week1App;
  
  it('adds the address if not found', () => {
    assert.equal(app.setInitialBalance('0x4'), 0);
  });

  it('sets a default balance for new addresses', () => {
   assert.equal(app.setInitialBalance('0x4'), 0);
  });

  it('get balance for address', (done) => {
    let zahra = app.actor_key_pairs['zahra']
    chai.request(server).get(`/balance/${zahra.public_key}`).end((err, res) => {
      res.should.have.status(200);
      res.body.balance.should.be.eq(100);
      done();
    });
  });

  it('should transfer funds from sender to receiver', async () => {
    let kate = app.actor_key_pairs['kate']
    let constance = app.actor_key_pairs['constance']
    let katePrivateKey = app.actor_key_pairs['kate'].private_key
    let response = await app.signMessage("10", katePrivateKey)
    let [signature, rb] = response

    chai.request(server)
      .post('/send')
      .send({sender: kate.public_key, amount: 10, senderSignature: signature, recipient: constance.public_key, rb: rb})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.balance.should.be.eq(40);
      });
  });

  it('should NOT transfer if the signature does not match', async () => {
    let kate = app.actor_key_pairs['kate']
    let constance = app.actor_key_pairs['constance']
    let katePrivateKey = app.actor_key_pairs['kate'].private_key
    let response = await app.signMessage("10", katePrivateKey)
    let [signature, rb] = response

    chai.request(server)
      .post('/send')
      .send({sender: kate.public_key, amount: 10, senderSignature: signature, recipient: constance.public_key, rb: rb})
      .end((err, res) => {
        res.should.have.status(400);
        err.message.should.eq("Key and Signature don't match");
      });
  });

  it('should NOT transfer if the amount makes the signature not match', async () => {
    let kate = app.actor_key_pairs['kate']
    let constance = app.actor_key_pairs['constance']
    let katePrivateKey = app.actor_key_pairs['kate'].private_key
    let response = await app.signMessage("20", katePrivateKey)
    let [signature, rb] = response

    chai.request(server)
      .post('/send')
      .send({sender: kate.public_key, amount: 10, senderSignature: signature, recipient: constance.public_key, rb: rb})
      .end((err, res) => {
        res.should.have.status(400);
        err.message.should.eq("Key and Signature don't match");
      });
  });

  it('should generate actor keypairs', () => {
    expect(app.generateKeyPairs()['zahra'].public_key).to.not.equal(null)
  });

});
