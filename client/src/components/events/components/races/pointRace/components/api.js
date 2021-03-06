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

  updateSprint(user, id, raceOrder, scoreId, sprint, sprintId) {
    const url = new URL(`${baseUrl}/api/events/${id}/races/${raceOrder}/scores/${scoreId}/sprints/${sprintId}`)
    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(sprint),
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  }
}
export default api