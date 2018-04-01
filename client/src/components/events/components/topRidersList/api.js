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
  getEvents(user, ) {
    const url = new URL(`${baseUrl}/api/events`)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  getScoresM(user, id) {
    const url = new URL(`${baseUrl}/api/events/${id}/scores/men`)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  getScoresW(user, id) {
    const url = new URL(`${baseUrl}/api/events/${id}/scores/women`)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  getScoresOverall(user, id, raceOrder, cat) {
    const url = new URL(`${baseUrl}/api/events/${id}/races/${raceOrder}/scores/category/${cat}/overall`)

    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  }
}

export default api