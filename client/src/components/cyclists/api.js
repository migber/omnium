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

  getScoresOverall(user, id, raceOrder, cat) {
    const url = new URL(`${baseUrl}/api/events/${id}/races/${raceOrder}/scores/category/${cat}`)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  updateCyclist(user, id, cyclist) {
    const url = new URL(`${baseUrl}/api/cyclists/${id}`)
    return fetch(url, {
      method: 'PUT',
      headers: getHeaders(user.accessToken, user),
      body: JSON.stringify(cyclist)
    })
    .then(response =>
      response.json())
  },

  updateScore(user, eventId, id, score) {
    const url = new URL(`${baseUrl}/api/events/${eventId}/scores/${id}`)
    return fetch(url, {
      method: 'PUT',
      headers: getHeaders(user.accessToken, user),
      body: JSON.stringify(score)
    })
    .then(response =>
      response.json())
  },
}

export default api
