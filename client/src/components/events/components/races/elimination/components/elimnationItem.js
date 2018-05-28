import React, { Component } from 'react'
import api from '../api'

class EliminationItem extends Component {
  constructor(props){
    super(props)
    this.state = {
      rankId: props.rankId,
      raceNumber: props.score.raceNumber,
      eventId: props.eventId,
      scoreId: props.score.id,
      bk: props.score.bk,
      dns: props.score.dns,
      dnf: props.score.dnf,
      dnq: props.score.dnq,
      positionBefore: props.score.positionBefore,
      points: props.score.points,
      finishPlace: props.score.finishPlace,
      place: props.score.place,
      firstName: props.score.Cyclist.firstName,
      lastName: props.score.Cyclist.lastName,
      uciCode: props.score.Cyclist.uciCode,
      nationality: props.score.Cyclist.nationality,
    }
  }

  render() {
    const {
      rankId,
      raceNumber,
      scoreId,
      bk,
      dns,
      dnf,
      dnq,
      points,
      finishPlace,
      place,
      firstName,
      lastName,
      uciCode,
      nationality,
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
          ) : bk ? (
            <td className="txt-big text">BK</td>
          ) : isStartList ? (
            <td className="txt-big text">{rankId +1}</td>
          ) : (
            <td className="txt-big text">{place}</td>
          )
        }
        <td className="raceNo txt-big text">{raceNumber}</td>
        <td className="txt-big text">{lastName} {firstName}</td>
        <td className="txt-big text">{uciCode}</td>
        <td className="txt-big text">{nationality}</td>
    </tr>
    )
  }
}

export default EliminationItem