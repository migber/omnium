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
  getRequests(user) {
    const url = new URL(`${baseUrl}/api/cyclists/notApproved`)
    console.log(url)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  getCyclist(user, id) {
    const url = new URL(`${baseUrl}/api/cyclists/${id}`)
    console.log(url)
    return fetch(url, {
      method: 'GET',
      headers: getHeaders(user.accessToken, user)
    })
    .then(response =>
      response.json())
  },

  updateCyclist(user, id, cyclist) {
    const url = new URL(`${baseUrl}/api/cyclists/${id}`)
    return fetch(url, {
      method: 'PUT',
      headers: getHeaders(user.accessToken, user),
      body: JSON.stringify(cyclist)
    })
    .then(response =>
      response.json())
  },

  deleteCyclist(user, id){
    const url = new URL(`${baseUrl}/api/cyclists/${id}`)
    console.log(url)
    return fetch(url, {
      method: 'DELETE',
      headers: getHeaders(user.accessToken, user)
    })
    .then()
  },

  approveCyclist(user, id, eventId){
    const url = new URL(`${baseUrl}/api/cyclists/approve/${id}`)
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

  registerScoreScratch(user, eventId, raceOrder, cyclistId) {
    const payload = {
    }
    const url = new URL(`${baseUrl}/api/events/${eventId}/races/${raceOrder}/scores`)
    return fetch(url, {
      method: 'PUT',
      headers: getHeaders(user.accessToken, user),
      body: formFormBody(payload)
    })
    .then()
  }
}

function formFormBody(payload) {
  let formBody = Object.keys(payload).map(key => key !== 'locale' && encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&')
  if (payload.locale) {
    formBody += '&'
    formBody += encodeArray('locale', payload.locale)
  }
  return formBody
}

function encodeArray(key, values) {
  return values.map(e => `${key}=${e}&`).join('')
}

export default api