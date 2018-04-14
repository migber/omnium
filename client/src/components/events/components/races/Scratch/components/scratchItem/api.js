const baseUrl = 'http://localhost:8080'

function getHeaders(authToken, user) {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('Accept', 'application/json')
  if (authToken) {
    headers.append('Authorization', `Bearer ${authToken}`)
  }
  return headers
}

const api = {

  // subscribeToTimer() {
  //   socket.on('timer', totalPoints => { return totalPoints })
  //   socket.emit('subscribeToTimer', 1000)
  // },

  updateCyclistFinisPlace(user, id, raceOrder, scoreId, score){
    const url = new URL(`${baseUrl}/api/events/${id}/races/${raceOrder}/scores/${scoreId}/finishPlace`)
    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(score),
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  getScoresOfSpecificRace(user, id, raceOrder, cat) {
    const url = new URL(`${baseUrl}/api/events/${id}/races/${raceOrder}/scores/category/${cat}`)
    console.log(url)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  addTwenty(user, id, raceOrder, scoreId) {
    const url = new URL(`${baseUrl}/api/events/${id}/races/${raceOrder}/scores/${scoreId}/lapPliusPoints`)
    console.log(url)
    return fetch(url, {
      method: 'PUT',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  subtractTwenty(user, id, raceOrder, scoreId) {
    const url = new URL(`${baseUrl}/api/events/${id}/races/${raceOrder}/scores/${scoreId}/lapMinusPoints`)
    return fetch(url, {
      method: 'PUT',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  updateDNS(user, id, raceOrder, scoreId) {
    const url = new URL(`${baseUrl}/api/events/${id}/races/${raceOrder}/scores/${scoreId}/dns`)
    return fetch(url, {
      method: 'PUT',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  updateDNQ(user, id, raceOrder, scoreId) {
    const url = new URL(`${baseUrl}/api/events/${id}/races/${raceOrder}/scores/${scoreId}/dnq`)
    return fetch(url, {
      method: 'PUT',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  updateDNF(user, id, raceOrder, scoreId) {
    const url = new URL(`${baseUrl}/api/events/${id}/races/${raceOrder}/scores/${scoreId}/dnf`)
    return fetch(url, {
      method: 'PUT',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

}
export default api