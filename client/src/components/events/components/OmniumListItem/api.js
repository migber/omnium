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

  getScoresFromRaces(user, id, raceNumber) {
    console.log('+++++++++++++')
    console.log(user)
    console.log('+++++++++++++')
    const url = new URL(`${baseUrl}/api/events/${id}/races/scores/${raceNumber}/allRaces`)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },
}
export default api