
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './elimination.css'
import raceApi from '../api'
import EliminationItem from './components/elimnationItem'
import helper from '../helper'

class Elimination extends Component {
  constructor(props){
    super(props)
    this.state = {
      menScores: null,
      raceId: null,
      eventName: null,
      cyclists: null,
      raceOrder: 3,
      category: null,
      womenScores: null,
      womenStartList: null,
      menScoresStartList: null,
    }
  }

  componentWillMount() {
    this.props.notShowEvents()
    localStorage.setItem('activeTab', 3)
    this.setState({ eventName: localStorage.getItem('eventName')})
    this.setState({
      category: localStorage.getItem('category')
    })
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      localStorage.getItem('category'),
     ).then( scores => {
        console.log(scores)
        const startList = helper.scratchRaceStartList(scores)
        const orderedScores = helper.orderByPlace(scores)
        console.log(orderedScores)
        this.setState({ menScores: orderedScores, menScoresStartList: startList})
    })
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      'women'
     ).then( scores => {
        const startList = helper.scratchRaceStartList(scores)
        const orderedScores = helper.orderByPlace(scores)
        this.setState({ womenScores: orderedScores, womenStartList: startList })
    })
  }

  render() {
    const { omniumId, activeTab, isStartList } = this.props
    const { races,
            scores,
            cyclists,
            menScores,
            womenScores,
            menScoresStartList,
            womenStartList  } = this.state
    const category = localStorage.getItem('category')
    return (
      <div className="space-from-top">
       { localStorage.getItem('activeTab') === '3' && (
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
                {
                  ( Number(localStorage.getItem('activeTab')) === 11 ||
                    Number(localStorage.getItem('activeTab')) === 22 ||
                    Number(localStorage.getItem('activeTab')) === 33 ||
                    Number(localStorage.getItem('activeTab')) === 44) ? (
                    <th scope="col"></th>
                  ): (
                    <th scope="col">Rank</th>
                  )
                }
              <th scope="col">No</th>
              <th scope="col">Name</th>
              <th scope="col">UCI code</th>
              <th scope="col">Nationality</th>
              </tr>
            )
          }
        </thead>
        <tbody>
        { category === 'men' ? (
          isStartList ? (
            menScoresStartList &&  menScoresStartList.map((score, id) => (
              <EliminationItem
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
            menScores &&  menScores.map((score, id) => (
              <EliminationItem
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
        ) : (
          isStartList ? (
            womenStartList && womenStartList.map((score, id) => (
              <EliminationItem
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
              <EliminationItem
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
        )
      }
          </tbody>
        </table>
      )}
      </div>
    )
  }
}

export default Elimination

