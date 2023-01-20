let chai = require('chai');  
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

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
    chai.request(server).get('/balance/0x3').end((err, res) => {
      res.should.have.status(200);
      res.body.balance.should.be.eq(75);
      done();
    });
  });

  it('should transfer funds from sender to receiver', (done) => {
    chai.request(server)
      .post('/send')
      .send({sender: "0x3", amount: 10, recipient: "0x2"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.balance.should.be.eq(65);
        done();
      });
  });

});
