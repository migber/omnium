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
  console.log(startList)
  return startList
}

function eliminationFinishOrder(scores){
  let ordered = []
  const disqualifiedScores = []
  scores.forEach(element => {
    if (element.dns) disqualifiedScores.push(element)
    else if (element.dnf) disqualifiedScores.push(element)
    else if (element.dnq) disqualifiedScores.push(element)
    else ordered.push(element)
  })
  ordered.sort(function(a, b) {
      return a.place - b.place
  })
  console.log(ordered)
  disqualifiedScores.sort(function(a, b) {
    return a.raceNumber - b.raceNumber
  })
  console.log(disqualifiedScores)
  const finalScores = ordered.concat(disqualifiedScores)
  return finalScores
}

function finishOrder(scores){
  let ordered = []
  const disqualifiedScores = []
  scores.forEach((element) => {
    if (element.dns) disqualifiedScores.push(element)
    else if (element.dnf) disqualifiedScores.push(element)
    else if (element.dnq) disqualifiedScores.push(element)
    else ordered.push(element)
  })
  console.log(disqualifiedScores)
  ordered.sort(function(a, b) {
    if (a.totalPoints === b.totalPoints) {
      return a.finishPlace - b.finishPlace
    } else {
      return b.totalPoints - a.totalPoints
    }
  })
  console.log(ordered)
  disqualifiedScores.sort(function(a, b) {
    return a.raceNumber - b.raceNumber
  })
  console.log(disqualifiedScores)
  const finalScores = ordered.concat(disqualifiedScores)
  return finalScores
}

function scratchRaceStartList(scores) {
  return scores.sort(function(a, b) {
    return a.raceNumber - b.raceNumber
  })
}

function eliminationEditSort(scores){
  let ordered = []
  const disqualifiedScores = []
  scores.forEach(element => {
    if (element.dns) disqualifiedScores.push(element)
    else if (element.dnf) disqualifiedScores.push(element)
    else if (element.dnq) disqualifiedScores.push(element)
    else ordered.push(element)
  })
  ordered.sort(function(a, b) {
      return a.raceNumber - b.raceNumber
  })
  return ordered
}

function orderByPointsBigger(scores) {
  return scores.sort(function(a, b) {
    return b.totalPoints - a.totalPoints
  })
}

function sortByRaceNumbers(scores) {
  return scores.sort(function(a, b) {
    return a.raceNumber - b.raceNumber
  })
}

function omniumOrder(scores) {
  let ordered = []
  const disqualifiedScores = []
  scores.forEach((score) => {
    if (score.dns) disqualifiedScores.push(score)
    else if (score.dnf) disqualifiedScores.push(score)
    else if (score.dnq) disqualifiedScores.push(score)
    else ordered.push(score)
  })
  disqualifiedScores.sort(function(a, b) {
    return a.raceNumber - b.raceNumber
  })
  ordered.sort(function(a, b) {
    if (a.totalPoints === b.totalPoints) {
      return a.finishPlace - b.finishPlace
    } else {
      return b.totalPoints - a.totalPoints
    }
  })
  const finalScores = ordered.concat(disqualifiedScores)
  return finalScores
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
  console.log("race helper calculate final")
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
      console.log(score.dnf)
      if (!score.dns && !score.dnq && !score.dnf) {
        if ((id + 1) < 21) {
          console.log('change')
          score.points = placePoints[id + 1]
        } else {
          console.log('else')
          score.points = placePoints[TWENTY_FIRST]
        }
        score.place = id + 1
        score.positionBefore = id + 1
      } else {
        console.log('should be here')
        score.points = 0
      }
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

function updatePosition(scores){
  if (scores) {
    scores.sort((a, b) => {
      return b.totalPoints - a.totalPoints
    })

  }
}

module.exports = {
  CreateStartList,
  finishOrder,
  scratchRaceStartList,
  givePlacePoints,
  calculateFinalRaceOrder,
  orderByPlace,
  orderByPointsBigger,
  updatePosition,
  omniumOrder,
  sortByRaceNumbers,
  eliminationEditSort,
  eliminationFinishOrder,
}