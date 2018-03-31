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
  getEvents(user) {
    const url = new URL(`${baseUrl}/api/events`)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  createEvent(user, event) {
    const url = new URL(`${baseUrl}/api/events`)
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(event),
      headers: getHeaders(user.accessToken, user)
    })
    .then(resp => resp.json())
  },

}

export default api