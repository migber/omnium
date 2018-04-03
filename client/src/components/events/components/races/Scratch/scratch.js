
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './scratch.css'
import raceApi from './api'
import ScratchItem from './components/scratchItem/scratchItem'

class Scratch extends Component {
  constructor(props){
    super(props)
    this.state = {
      menScores: null,
      raceId: null,
      eventName: null,
      cyclists: null,
      raceOrder: 1,
      category: null,
      womenScores: null,
    }
  }

  componentWillMount() {
    console.log('ScratchInside')
    this.setState({ eventName: localStorage.getItem('eventName')})
    this.setState({
      category: localStorage.getItem('category')
    })
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.location.pathname,
      localStorage.getItem('category'),
     ).then( scores => {
      this.setState({ menScores: scores })
    })
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.location.pathname,
      'women'
     ).then( scores => {
      this.setState({ womenScores: scores })
    })
  }

  render() {
    const { omniumId, activeTab, isStartList } = this.props
    const { races, scores, cyclists, menScores, womenScores } = this.state
    const category = localStorage.getItem('category')
    return (
      <div className="space-from-top">
       { localStorage.getItem('activeTab') === '1' && (
        <table className="table table-striped">
        <thead>
          {
            isStartList ? (
              <tr >
              <th scope="col">Order</th>
              <th scope="col">No</th>
              <th scope="col">Name</th>
              <th scope="col">UCI code</th>
              <th scope="col">Nationality</th>
              </tr>
            ) : (
              <tr>
              <th scope="col">Rank</th>
              <th scope="col">No</th>
              <th scope="col">Name</th>
              <th scope="col">UCI code</th>
              <th scope="col">Nationality</th>
              <th scope="col">+20</th>
              <th scope="col">-20</th>
              <th scope="col">Finish place</th>
              <th scope="col">Total points</th>
              </tr>
            )
          }
        </thead>
        <tbody>
        { category === 'men' ? (
          menScores &&  menScores.map((score, id) => (
            <ScratchItem
              key={`${score.id}${Math.random()}`}
              score={score}
              eventId={this.state.eventId}
              user={this.props.user}
              rankId={id}
              isStartList={this.props.isStartList}
              category={this.state.category}
            />
          ))
        ) : (
          womenScores && womenScores.map((score, id) => (
            <ScratchItem
              key={`${score.id}${Math.random()}`}
              score={score}
              eventId={this.state.eventId}
              user={this.props.user}
              rankId={id}
              isStartList={this.props.isStartList}
              category={this.state.category}
            />
          ))
        )
      }
          {/* //   return (
          //     <tr key={id} className="left">
          //     <th key={id} scope="row">{score.finishPlace}</th>
          //     <td className="number">{score.raceNumber}</td>
          //     <td>{score.Cyclist.firstName} {score.Cyclist.lastName}</td>
          //     <td>{score.Cyclist.nationality}</td>
          //     <td>{score.points}</td>
          //     <td>{score.totalPoints}</td>
          //     </tr>
          //   )
          // })} */}
          </tbody>
        </table>
      )}
      </div>
    )
  }
}

export default Scratch

