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
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },
  getScores(user, id) {
    const url = new URL(`${baseUrl}/api/events/${id}/scores`)
    console.log(url)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },
  getWomenData(user, id) {
    const url = new URL(`${baseUrl}/api/events/${id}/scores/women`)
    console.log(url)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },
  getMenData(user, id) {
    const url = new URL(`${baseUrl}/api/events/${id}/scores/men`)
    console.log(url)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },
}
export default api