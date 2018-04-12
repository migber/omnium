const { placePoints, finishPlaceToPoints, sprintPoints } = require('./constants/constants')
const api = require('./api')
const TWENTY_FIRST = 21

function CreateStartList(scores) {
  const startList = []
  if (scores.length !== 0 ){
    scores.forEach(element => {
      // if (!element.dns && !element.dnq && !element.dnf ){
        startList.push(element)
      // }
    })
    startList.sort(function(a, b) {
      return a.raceNumber - b.raceNumber
    })
  }
  return startList
}

function finishOrder(scores){
  let ordered = []
  const disqualifiedScores = []
  scores.forEach(element => {
    if (element.dns) disqualifiedScores.push(element)
    else if (element.dnf) disqualifiedScores.push(element)
    else if (element.dnq) disqualifiedScores.push(element)
    else ordered.push(element)
  })
  ordered.sort(function(a, b) {
    if (a.totalPoints === b.totalPoints)
      return a.raceNumber - b.raceNumber
  })
  disqualifiedScores.sort(function(a, b) {
    return a.raceNumber - b.raceNumber
  })
  const finalScores = ordered.concat(disqualifiedScores)
  return finalScores
}

function scratchRaceStartList(scores) {
  return scores.sort(function(a, b) {
    return a.raceNumber - b.raceNumber
  })
}

function orderByPointsBigger(scores) {
  return scores.sort(function(a, b) {
    return b.totalPoints - a.totalPoints
  })
}

function finishOrderInOther(scores){
  let ordered = []
  const disqualifiedScores = []
  scores.forEach(element => {
    if (element.dns) disqualifiedScores.push(element)
    else if (element.dnf) disqualifiedScores.push(element)
    else if (element.dnq) disqualifiedScores.push(element)
    else ordered.push(element)
  })
  ordered.sort(function(a, b) {
    if (a.totalPoints === b.totalPoints)
      return b.finishPlace - a.finishPlace
  })
  disqualifiedScores.sort(function(a, b) {
    return a.raceNumber - b.raceNumber
  })
  const finalScores = ordered.concat(disqualifiedScores)
  return finalScores
}

function createDNXArray(scores) {
  let disqualifiedScores = []
  scores.forEach(element => {
    if (element.dns) disqualifiedScores.push(element)
    else if (element.dnf) disqualifiedScores.push(element)
    else if (element.dnq) disqualifiedScores.push(element)
  })
  return disqualifiedScores
}

function createFinishedCyclistArray(scores) {
  let finished = []
  scores.forEach(element => {
    if (!element.dns && !element.dnf && !element.dnq){
      finished.push(element)
    }
  })
  return finished
}


function givePlacePoints(scores) {
  if (scores.length !== 0) {
   console.log('inside')
    scores.forEach((score) => {
      if (!score.dns || !score.dnq || !score.dnf) {
        if (score.finishPlace < 21) {
          score.points = placePoints[score.finishPlace]
        } else {
          score.points = placePoints[TWENTY_FIRST]
        }
      } else {
        score.points = 0
      }
    })
  }
  return scores
}

function calculateFinalRaceOrder(scores) {
  let orderWithSamePoints = []
  if (scores.length !== 0) {
    const orderedScores = orderByPointsBigger(scores)
    console.log(orderedScores)
    orderWithSamePoints = orderIfThereEqualPoints(orderedScores)
    const finished = createFinishedCyclistArray(orderWithSamePoints)
    const disqualified = createDNXArray(orderWithSamePoints)
    disqualified.sort(function(a, b) {
      return a.raceNumber - b.raceNumber
    })
    const finalCyclistList = finished.concat(disqualified)
    console.log(finalCyclistList)
    finalCyclistList.forEach((score, id) => {
      console.log(score.dnf )
        if ((id + 1) < 21) {
          console.log('change')
          score.points = placePoints[id + 1]
        } else {
          console.log('else')
          score.points = placePoints[TWENTY_FIRST]
        }
        score.place = id + 1
        score.positionBefore = id + 1
    })
    return finalCyclistList
  }
}

function orderIfThereEqualPoints(scores) {
  return scores.sort(function(a, b) {
      if (a.totalPoints === b.totalPoints) {
        return a.finishPlace - b.finishPlace
      } else {
        return b.totalPoints - a.totalPoints
      }
  })
}

function orderByPlace(scores) {
  return scores.sort(function(a, b) {
    return a.place - b.place
  })
}

module.exports = {
  CreateStartList,
  finishOrder,
  scratchRaceStartList,
  givePlacePoints,
  calculateFinalRaceOrder,
  orderByPlace,
  orderByPointsBigger,
}