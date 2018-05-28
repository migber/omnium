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

  postCyclist(user, data) {
    const url = new URL(`${baseUrl}/api/cyclists/myTeam`)
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  getCyclists(user) {
    const url = new URL(`${baseUrl}/api/cyclists/users/${user.id}`)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  getCyclistsAnalytics(user) {
    const url = new URL(`${baseUrl}/api/cyclists/users/${user.id}/analytics`)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },
}

export default api
