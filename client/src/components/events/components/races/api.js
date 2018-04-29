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
  getRaces(user, id) {
    const url = new URL(`${baseUrl}/api${id}`)
    console.log(id)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },
  getScores(user, id) {
    const url = new URL(`${baseUrl}/api/events/${id}/scores`)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  getWomenData(user, id) {
    const url = new URL(`${baseUrl}/api/events/${id}/scores/women`)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },
  getMenData(user, id) {
    const url = new URL(`${baseUrl}/api/events/${id}/scores/men`)
    return fetch(url, {
      method: 'GET',
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

  updateRacePointsBasedOnPlace(user, id, raceOrder, scoreId, score) {
    const url = new URL(`${baseUrl}/api/events/${id}/races/${raceOrder}/scores/${scoreId}/points`)
    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(score),
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  updateTotalScoresOmniumOverall(user, id, data) {
    const url = new URL(`${baseUrl}/api/events/${id}/races/0/scores/specific`)
    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  updateElapsedTime(user, id, raceId, data) {
    const url = new URL(`${baseUrl}/api/events/${id}/races/${raceId}/elapsedTime`)
    console.log(data)
    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  updateAvgSpeed(user, id, raceId, data) {
    const url = new URL(`${baseUrl}/api/events/${id}/races/${raceId}/avgSpeed`)
    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  updateCommunique(user, id, raceId, data) {
    const url = new URL(`${baseUrl}/api/events/${id}/races/${raceId}/communique`)
    console.log(url)
    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  }
}
export default api