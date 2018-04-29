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
  getUserRequests(user) {
    const url = new URL(`${baseUrl}/api/users/notApproved`)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  deleteUser(user, id){
    const url = new URL(`${baseUrl}/api/users/${id}`)
    return fetch(url, {
      method: 'DELETE',
      headers: getHeaders(user.accessToken, user)
    })
    .then()
  },

  approveUser(user, id, eventId){
    console.log(user)
    const url = new URL(`${baseUrl}/api/users/${id}/approve`)
    const payload = {
      approved: true,
      eventId
    }
    return fetch(url, {
      method: 'PUT',
      headers: getHeaders(user.accessToken, user),
      body: JSON.stringify(payload)
    })
    .then()
  },
}

export default api