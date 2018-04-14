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
  getRacesByCategory(user, id) {
    const url = new URL(`${baseUrl}/api${id}`)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  getScores(user, id) {
    const url = new URL(`${baseUrl}/api${id}/scores`)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  createSprints(user, id, raceOrder, scoreId, sprint) {
    const url = new URL(`${baseUrl}/api/events/${id}/races/${raceOrder}/scores/${scoreId}/sprints`)
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(sprint),
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  updateFinishPlace(user, id, raceOrder, scoreId, score){
    const url = new URL(`${baseUrl}/api/events/${id}/races/${raceOrder}/scores/${scoreId}/finishPlace`)
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