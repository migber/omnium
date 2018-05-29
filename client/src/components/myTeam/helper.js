'use strict'

function getAnalyticsData(cyclists) {
  let analytics = []
  if (cyclists.length !== 0) {
    cyclists.forEach((cyclist) => {
      const events = cyclist.Scores.length / 5
      const scores = cyclist.Scores
      console.log(events)
      let scratch = 0
      let tempo = 0
      let elim = 0
      let pointrace = 0
      let positionScratch = 0
      let positionElim = 0
      let positionTempo = 0
      let positionPointRace = 0
      scores.forEach((score) => {
        switch (score.Race.order) {
          case 0: {
            pointrace = pointrace + Number(score.total_points)
            positionPointRace = positionPointRace + Number(score.place)
          }
            break;
          case 1: {
            scratch = scratch + Number(score.total_points)
            positionScratch = positionScratch + Number(score.finishPlace)
          }
            break;
          case 2: {
            tempo = tempo + Number(score.total_points)
            positionTempo = positionTempo + Number(score.finishPlace)
          }
           break;
          case 3: {
            elim =  elim + Number(score.points)
            positionElim = positionElim + Number(score.place)
          }
            break;
          default:
            break;
        }
      })
      const cyclistAnalytics = {
        id: cyclist.id,
        firstName: cyclist.firstName,
        lastName: cyclist.lastName,
        uciCode: cyclist.uciCode,
        category: cyclist.category,
        events,
        scratch,
        positionScratch: positionScratch / Number(events),
        positionTempo: positionTempo / Number(events),
        positionElim: positionElim / Number(events),
        positionPointRace: positionPointRace / Number(events),
        tempo,
        elim,
        pointrace,
      }
      analytics.push(cyclistAnalytics)
    })
    return analytics
  }
}

module.exports = {
  getAnalyticsData,
}