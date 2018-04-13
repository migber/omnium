function changeFinishOrder(scores) {
  if(scores){
    let scoresUpdate = []
    console.log('changeFinish order')
    console.log(scores)
    scores.forEach((score, index) => {
      if (!score.dns || !score.dnq || !score.dnf) {
        score.finishPlace =  index + 1
      } else {
        score.finishPlace = 0
      }
      scoresUpdate.push(score)
    })
    return scoresUpdate
  }
}

function reorder(list, startIndex, endIndex){
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export {
  changeFinishOrder,
  reorder
}