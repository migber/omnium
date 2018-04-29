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

  postUserRequest(userData) {
    const url = new URL(`${baseUrl}/api/newUser`)
    console.log(userData)
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: getHeaders(null, null)
    })
    .then(response =>
      response.json())
  },
}

export default api
