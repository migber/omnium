const controllerScore = require('./controllers/score')

module.exports = (io) => {
  io.on('connection', (client) => {
    client.on('subscribeToTimer', (interval) => {
      console.log('client is subscribing to timer with interval ', interval)
      setInterval(() => {
        client.emit('timer', new Date())
      }, interval)
    })
    client.on('SEND_MESSAGE', (data) => {
      controllerScore
      io.emit('RECEIVE_MESSAGE', data)
    })
  })
}
