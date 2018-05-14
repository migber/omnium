
module.exports = {
  'Omnium' : function (client) {
    client
      .url('http://localhost:3000')
      .waitForElementVisible('body', 1000)
      .assert.title('Omnium')
      .end();
  },
  'NavBar': function (client) {
    client
    .url('http://localhost:3000')
    .expect.element('.extra-features').to.be.visible
  },
  'NavBar cyclists': function (client) {
    client
    .url('http://localhost:3000')
    .click('a [id=cyclists]', function(response){
      this.assert.ok(client === this, "Check if the context is right.");
      this.assert.ok(typeof response == "object", "We got a response object.");
    })
    .end()
  },
  'NavBar registration': function (client) {
    client
    .url('http://localhost:3000')
    .click('a [id=registration]', function(response){
      this.assert.ok(client === this, "Check if the context is right.");
      this.assert.ok(typeof response == "object", "We got a response object.");
    })
    .end()
  },
  'NavBar register': function (client) {
    client
    .url('http://localhost:3000')
    .click('a [id=register]', function(response){
      this.assert.ok(client === this, "Check if the context is right.");
      this.assert.ok(typeof response == "object", "We got a response object.");
    })
    .end()
  },
  'NavBar events list item': function (client) {
    client
    .url('http://localhost:3000/events')
    .expect.element('ul').to.be.visible
  },
  'NavBar events list item jjj': function (client) {
    client
    .url('http://localhost:3000/events')
    .waitForElementVisible('ul', 1000, function(){
      this
      .click('a [name="eventsItem"]', function(response){
        this.assert.ok(client === this, "Check if the context is right.");
        this.assert.ok(typeof response == "object", "We got a response object.");
      })
    })
    .end()
  }
};