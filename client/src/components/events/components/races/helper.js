function CreateStartList(scores) {
  const startList = []
  if (scores.length !== 0 ){
    scores.forEach(element => {
      // if (!element.dns && !element.dnq && !element.dnf ){
        startList.push(element)
      // }
    })
  }
  console.log(startList)
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
  console.log(disqualifiedScores)
  disqualifiedScores.sort(function(a, b) {
    return a.raceNumber - b.raceNumber
  })
  const finalScores = ordered.concat(disqualifiedScores)
  console.log(finalScores)
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
  console.log(disqualifiedScores)
  disqualifiedScores.sort(function(a, b) {
    return a.raceNumber - b.raceNumber
  })
  const finalScores = ordered.concat(disqualifiedScores)
  console.log(finalScores)
  return finalScores
}

module.exports = {
  CreateStartList,
  finishOrder,
}