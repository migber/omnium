function sortByRaceNumber(scores) {
  return scores.sort((a, b) => {
    return a.raceNumber - b.raceNumber
  })
}

export default {
  sortByRaceNumber
}