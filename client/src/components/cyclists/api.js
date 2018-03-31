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
  getScoresWomen(user, eventId) {
    const url = new URL(`${baseUrl}/api/events/${eventId}/scores/women`)
    console.log(url)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  getScoresMen(user, eventId) {
    const url = new URL(`${baseUrl}/api/events/${eventId}/scores/men`)
    console.log(url)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  updateCyclist(user, id, cyclist) {
    const url = new URL(`${baseUrl}/api/cyclists/${id}`)
    console.log(url)
    return fetch(url, {
      method: 'PUT',
      headers: getHeaders(user.accessToken, user),
      body: JSON.stringify(cyclist)
    })
    .then(response =>
      response.json())
  },

  updateScore(user, eventId, id, score) {
    console.log(id, eventId)
    console.log(score)
    const url = new URL(`${baseUrl}/api/events/${eventId}/scores/${id}`)
    console.log(url)
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
