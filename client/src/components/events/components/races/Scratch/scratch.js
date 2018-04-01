
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './scratch.css'
import api from './api'

class Scratch extends Component {
  constructor(props){
    super(props)
    this.state = {
      scores: null,
      raceId: null,
      eventName: null,
      cyclists: null,
      raceOrder: 1,
      category: null,
    }
  }

  componentWillMount() {
    this.setState({ eventName: localStorage.getItem('eventName')})
    this.setState({
      category: this.props.category
    })
    api.getScoresOfSpecificRace(
      this.props.user,
      this.props.location.pathname,
      this.props.category
     ).then( scores => {
      this.setState({ scores })
    })
  }

  render() {
    const { omniumId, activeTab } = this.props
    const { races, scores, cyclists } = this.state
    console.log(scores)
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
              <td className="number">{score.raceNumber}</td>
              <td>{score.Cyclist.firstName} {score.Cyclist.lastName}</td>
              <td>{score.Cyclist.nationality}</td>
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

