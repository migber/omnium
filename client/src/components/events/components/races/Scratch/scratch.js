
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './scratch.css'
import api from './api'

class Scratch extends Component {
  constructor(props){
    super(props)
    this.state = {
      races: null,
      raceId: null,
      eventName: null,
      scores: null,
      cyclists: null,
    }
    this.getCyclistData = this.getCyclistData.bind(this)
  }

  componentWillMount() {
    console.log(this.props)
    this.setState({ eventName: localStorage.getItem('eventName')})
    api.getRacesByCategory(this.props.user, this.props.location.pathname ).then( races => {
      this.setState({ races })
    })
    api.getScores(this.props.user, this.props.location.pathname).then(scores => {
      console.log('scores')
      console.log(scores)
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
      console.log(scores)
      localStorage.setItem('scores', JSON.stringify(scoresMapped))
      this.setState({ scores })
    })
    api.getCyclistForScores(this.props.user).then(cyclists => {
      this.setState({cyclists})
      localStorage.setItem('cyclists', JSON.stringify(cyclists))
    })
  }

  getCyclistData(id){
    if(this.state.cyclists) {
      this.state.cyclists.map(cyclist => {
        console.log(` ID ${id}`)
        console.log(`CYclists `)
        console.log(cyclist)
        console.log(`${cyclist.id} ${id}`)
        if(cyclist.id === id)
        console.log(cyclist)
         return cyclist
      })
    }
  }

  render() {
    const { omniumId, activeTab } = this.props
    const { races, scores, cyclists } = this.state

    return (
      <div className="space-from-top">
       { localStorage.getItem('activeTab') === '1' && (
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
        <tbody>
        { scores && scores.map(function(score, id){
            return (
              <tr key={id} className="left">
              <th key={id} scope="row">{score.finishPlace}</th>
              <td>{score.raceNumber}</td>
              {/* <td> {score['Cyclist'].lastName}</td> */}
              <td>{}</td>
              <td>{score.points}</td>
              <td>{score.totalPoints}</td>
              </tr>
            )
          })}
          </tbody>
        </table>
      )}
      </div>
    )
  }
}

export default Scratch

