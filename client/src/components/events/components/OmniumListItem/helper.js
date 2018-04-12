function getAllPointsFromDifferentRacesInObject(scores){
  const scoreObj = {
    scratch: 0,
    tempo: 0,
    elimination: 0,
    pointRace: 0,
    total: 0,
  }
  if (scores) {
    for (let i  = 0; i < scores.length; i++){
      switch (scores[i].Race.order) {
        case 0:
          scoreObj.total = scores[i].totalPoints
        break;
        case 1:
          scoreObj.scratch = scores[i].points
        break;
        case 2:
          scoreObj.tempo = scores[i].points
        break;
        case 3:
         scoreObj.elimination = scores[i].points
        break;
        case 4:
          scoreObj.pointRace = scores[i].points
        break;
        default:
          break;
      }
    }
  }
  return scoreObj
}

export default {
  getAllPointsFromDifferentRacesInObject,
}