describe('transfers app', () => {
  let keyPairData = {};
  let balancesData = {};
  
  before(() => {
    cy.fixture('key_pairs').then((data) => { 
      keyPairData = data; 
    });
    cy.fixture('balances').then((data) => { 
      balancesData = data; 
    });
  });

  it('Renders the page', () => {
    cy.visit('http://localhost:5173/')
    cy.contains('Your Wallet')
    cy.contains('Send Transaction')
  });

  it('Can show a balance for an address (zahra)', () => {
    cy.visit('http://localhost:5173/')
    cy.get('.wallet input').type(keyPairData['zahra'].public_key)
    cy.get('.balance').should('include.text', '100')
  });

  it('Can transfer funds from zahra to kate address', () => {
    cy.visit('http://localhost:5173/')
    cy.get('.wallet input').type(keyPairData['zahra'].public_key)
    cy.get('.transfer > :nth-child(2) > input').type('10')
    cy.get(':nth-child(3) > input').type(keyPairData['kate'].public_key)
    cy.get('.button').click()
    cy.get('.balance').should('include.text', '90')
  });

  it('Throws an error if there is not enough funds', () => {
    cy.visit('http://localhost:5173/')
    cy.get('.wallet input').type('0x2')
    cy.get('.transfer > :nth-child(2) > input').type('50')
    cy.get(':nth-child(3) > input').type('0x3')
    cy.get('.button').click()
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Not enough funds');
    })
  });
})