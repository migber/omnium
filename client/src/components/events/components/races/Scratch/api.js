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

  getScoresOfSpecificRace(user, id, cat) {
    const url = new URL(`${baseUrl}/api${id}/scores/category/${cat}`)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  updateScore(user, id, raceOrder, scoreId, score) {
    const url = new URL(`${baseUrl}/api/events/${id}/races/${raceOrder}/scores/${scoreId}`)
    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(score),
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  }
}
export default api