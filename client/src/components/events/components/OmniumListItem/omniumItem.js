import React, { Component } from 'react'
import api from './api'
import helper from './helper'

class OmniumItem extends Component {
  constructor(props){
    super(props)
    this.state = {
      rankId: props.rankId,
      raceNumber: props.score.raceNumber,
      eventId: props.eventId,
      scoreId: props.score.id,
      dns: props.score.dns,
      dnf: props.score.dnf,
      dnq: props.score.dnq,
      positionBefore: props.score.positionBefore,
      points: props.score.points,
      place: props.score.place,
      totalPoints: props.score.totalPoints,
      firstName: props.score.Cyclist.firstName,
      lastName: props.score.Cyclist.lastName,
      uciCode: props.score.Cyclist.uciCode,
      nationality: props.score.Cyclist.nationality,
      raceScores: null,
    }
  }

  componentWillMount(){
    const { score, eventId, rankId } = this.props
    api.getScoresFromRaces(this.props.user, eventId, score.raceNumber).then((scores) => {
      const updatedObjec = helper.getAllPointsFromDifferentRacesInObject(scores)
      this.setState({
        raceScores: updatedObjec
      })
    })
  }

  render() {
    const {
      rankId,
      raceNumber,
      scoreId,
      positionBefore,
      points,
      finishPlace,
      place,
      dns,
      dnf,
      dnq,
      totalPoints,
      firstName,
      lastName,
      uciCode,
      nationality,
      raceScores,
    } = this.state
    const { isStartList } = this.props
    return (
      <tr>
        {
           dns ? (
            <td className="txt-big text">DNS</td>
          ) : dnf ? (
            <td className="txt-big text">DNF</td>
          ) : dnq ? (
            <td className="txt-big text">DNQ</td>
          ) : (
            <td className="txt-big text">{rankId + 1}</td>
          )
        }
        <td className="raceNo txt-big text">{raceNumber}</td>
        <td className="txt-big text">{lastName} {firstName}</td>
        <td className="txt-big text">{uciCode}</td>
        <td className="txt-big text">{nationality}</td>
        {
          !isStartList && raceScores && (
            <td className="txt-big text">{raceScores.scratch}</td>
            )
          }
        {
          !isStartList && raceScores && (
            <td className="txt-big text">{raceScores.tempo}</td>
          )
        }
        {
          !isStartList && raceScores && (
            <td className="txt-big text">{raceScores.elimination}</td>
          )
        }
        {
          !isStartList && raceScores && (
                <td className="txt-big text">{raceScores.pointRace}</td>
          )
        }
        {
          !isStartList && raceScores && (
                <td className="txt-big text">{raceScores.total}</td>
          )
        }
    </tr>
    )
  }
}

export default OmniumItem