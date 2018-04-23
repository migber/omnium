function orderByPoints(scores){
  let ordered = []
  scores.forEach(element => {
    if (!element.dns && !element.dnf && !element.dnq)
     ordered.push(element)
  })
  ordered.sort(function(a, b) {
      return b.points - a.points
  })
  return ordered
}

function orderByTotalPoints(scores){
  let ordered = []
  scores.forEach(element => {
    if (!element.dns && !element.dnf && !element.dnq)
     ordered.push(element)
  })
  ordered.sort(function(a, b) {
      return b.totalPoints - a.totalPoints
  })
  return ordered
}


export default {
  orderByPoints,
  orderByTotalPoints,
}