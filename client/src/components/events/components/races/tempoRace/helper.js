function orderByPoints(scores){
  console.log(scores)
  let ordered = []
  scores.forEach(element => {
    if (!element.dns && !element.dnf && !element.dnq)
     ordered.push(element)
  })
  ordered.sort(function(a, b) {
      return b.points - a.points
  })
//   ordered.sort(function(a, b) {
//     if (b.points === a.points)
//     return a.raceNumber - b.raceNumber
// })
  return ordered
}

function orderByTotalPoints(scores){
  console.log(scores)
  let ordered = []
  scores.forEach(element => {
    if (!element.dns && !element.dnf && !element.dnq)
     ordered.push(element)
  })
  ordered.sort(function(a, b) {
      return b.totalPoints - a.totalPoints
  })
//   ordered.sort(function(a, b) {
//     if (b.points === a.points)
//     return a.raceNumber - b.raceNumber
// })
  return ordered
}


export default {
  orderByPoints,
  orderByTotalPoints,
}