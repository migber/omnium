
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './pointRace.css'
import api from './api'

class PointRace extends Component {
  constructor(props){
    super(props)
    this.state = {
      races: null,
      raceId: null,
      eventName: null,
      scores: null,
    }
  }

  componentWillMount() {
    this.setState({ eventName: localStorage.getItem('eventName')})
    api.getRacesByCategory(this.props.user, this.props.location.pathname ).then( races => {
      this.setState({ races })
    })
    api.getScores(this.props.user, this.props.location.pathname).then(scores => {
      const scoresMapped = []
      scores.forEach(element => {
        const scoresObj = {
          "id": element.id,
          "raceNumber": element.raceNumber,
          "lapPlusPoints": element.lapPlusPoints,
          "lapMinusPoints": element.lapMinusPoints,
          "points": element.points,
          "finishPlace": element.finishPlace,
          "raceDate": element.raceDate,
          "place": element.place,
          "totalPoints": element.totalPoints,
          "dns": element.dns,
          "dnq": element.dnq,
          "dnf": element.dnf,
          "bk": element.bk,
          "createdAt": element.createdAt,
          "updatedAt": element.updatedAt,
          "cyclistId": element['CyclistId'],
          "raceId": element['RaceId'],
          "race": {
              "id": element['Race'].id,
              "elapseTime": element['Race'].elapseTime,
              "name": element['Race'].name,
              "avgSpeed": element['Race'].avgSpeed,
              "order": element['Race'].order,
              "description": element['Race'].description,
              "createdAt": element['Race'].createdAt,
              "updatedAt": element['Race'].updatedAt,
              "eventId": element['Race']['EventId']
          }
        }
       scoresMapped.push(scoresObj)
      })
      localStorage.setItem('scores', JSON.stringify(scoresMapped))
      this.setState({ scores: scoresMapped })
    })
  }

  render() {
    const { omniumId, activeTab } = this.props
    const { races, scores } = this.state

    return (
     <div className="space-from-top">
       { localStorage.getItem('activeTab') === '4' && (
        <table className="table table-striped">
        <thead>
        <tr >
        <th scope="col">Rank</th>
        <th scope="col">No</th>
        <th scope="col">Name</th>
        <th scope="col">Nationality</th>
        <th scope="col">Points</th>
        <th scope="col">Total points</th>
        </tr>
        </thead>
        { scores ? (
          <tbody>
           { scores.map((score, id) => {
            return (
              <tr className="left">
              <th scope="row">{score.finishPlace}</th>
              <td>{score.raceNumber}</td>
              {/* <td> {score.cyclist.lastName}</td> */}
              <td>{}</td>
              <td>{score.points}</td>
              <td>{score.totalPoints}</td>
              </tr>
            )
          })} </tbody> ) : (
            <div> </div>
          )}
        </table>
      )}
      </div>
    )
  }
}

export default PointRace

