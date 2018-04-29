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
  getUser(user, data) {
    const url = new URL(`${baseUrl}/api/users/login`)
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },
}

export default api