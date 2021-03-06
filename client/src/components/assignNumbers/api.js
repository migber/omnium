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
  getScores(user, eventId) {
    const url = new URL(`${baseUrl}/api/events/${eventId}/scores/assignNumber`)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  getScoresForBagdes(user) {
    const url = new URL(`${baseUrl}/api/scores/assignNumber`)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  getScoresWomen(user, eventId) {
    const url = new URL(`${baseUrl}/api/events/${eventId}/scores/women`)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  getScoresMen(user, eventId) {
    const url = new URL(`${baseUrl}/api/events/${eventId}/scores/men`)
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

  updateCyclistRaceNumber(user, eventId,  id, score) {
    const url = new URL(`${baseUrl}/api/events/${eventId}/scores/${id}/raceNumber`)
    return fetch(url, {
      method: 'PUT',
      headers: getHeaders(user.accessToken, user),
      body: JSON.stringify(score)
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

  deleteScore(user, id) {
    const url = new URL(`${baseUrl}/api/scores/${id}`)
    return fetch(url, {
      method: 'DELETE',
      headers: getHeaders(user.accessToken, user),
    })
    .then()
  },
}

export default api
