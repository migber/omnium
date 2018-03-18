
import React, { Component } from 'react'
import './topRidersList.css'
import api from './api'

class FirstRidersList extends Component {
  constructor(props){
    super(props)
    this.state = {
      scoresM: null,
      scoresW: null,
    }
  }
  componentWillMount() {
    this.setState({ omniumId: localStorage.getItem('omniumId')})
    api.getScoresM(this.props.user, localStorage.getItem('omniumId')).then(scores => {
     console.log('Inside OverallOmniu MAn')
     this.setState({ scoresM: scores})
    })
    api.getScoresW(this.props.user, localStorage.getItem('omniumId')).then(scores => {
      console.log('Inside OverallOmniu WOmen')
      console.log(scores)

      this.setState({ scoresW: scores})
     })
  }

  render() {
   const { eventName } = this.props
   const { scoresM, scoresW } = this.state
   let screM = []
    return (
      <div className="from-left right-half">
      <h2>Overall standings</h2>
      <h3>Men results</h3>
      <table className="table table-striped">
         <thead>
         <tr className="fit" >
         <th scope="col">Rank</th>
         <th scope="col">No</th>
         <th scope="col">Name</th>
         <th scope="col">Total points</th>
         </tr>
         </thead>
         <tbody>
         { scoresM && scoresM.slice(0, 4).map(function(score, id) {
            return (
              <tr key={id} className="left fit">
              <th key={id} scope="row">{score.finishPlace}</th>
              <td>{score.raceNumber}</td>
              <td> {score.Cyclist.lastName}</td>
              <td className="center">{score.totalPoints}</td>
              </tr>
            )
          })}
         </tbody>
         </table>
         <h3>Women results</h3>
         <table className="table table-striped">
         <thead>
         <tr className="fit">
         <th scope="col">Rank</th>
         <th scope="col">No</th>
         <th scope="col">Name</th>
         <th scope="col">Total points</th>
         </tr>
         </thead>
         <tbody>
         { scoresW && scoresW.slice(0, 4).map(function(score, id) {
            return (
              <tr key={id} className="left fit">
              <th key={id} scope="row">{score.finishPlace}</th>
              <td>{score.raceNumber}</td>
              <td> {score.Cyclist.lastName}</td>
              <td className="center">{score.totalPoints}</td>
              </tr>
            )
          })}
         </tbody>
         </table>
      </div>
    )
  }
}

export default FirstRidersList

