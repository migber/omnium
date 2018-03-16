'use strict'

function responseBadRequest(message) {
  const response = {
    Result: 'ERROR',
    Message: message || 'Validation error',
  }
  return response
}

module.exports = responseBadRequest
