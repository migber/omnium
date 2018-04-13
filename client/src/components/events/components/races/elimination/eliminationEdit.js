
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './elimination.css'
import raceApi from '../api'
import api from './api'
import EliminationItemEdit from './components/eliminationEditItem'
import helper from '../helper'
import { placePoints } from '../constants/constants'

class EliminationEdit extends Component {
  constructor(props){
    super(props)
    this.state = {
      scores: null,
      raceId: null,
      eventName: null,
      cyclists: null,
      raceOrder: 3,
      category: 'men',
      womenScores: null,
      womenStartList: null,
      scoresList: null,
      eliminatedCounter: null
    }
    this.eliminateCyclist = this.eliminateCyclist.bind(this)
  }

  componentWillMount() {
    this.props.notShowEvents()
    localStorage.setItem('activeTab', 33)
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
        this.setState({
           scores: orderedScores,
           scoresList: startList,
           eliminatedCounter: orderedScores.length,
        })
    })
  }

  eliminateCyclist(scoreId){
    const score = {
      finishPlace: this.state.eliminatedCounter,
      points: placePoints[this.state.eliminatedCounter]
    }
    api.eliminateCyclist(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      scoreId,
      score,
    ).then((score) => {
      const elim = this.state.eliminatedCounter - 1
      this.setState({
        eliminatedCounter: elim
      })
    })
  }

  changeList(category){
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      category,
     ).then( scores => {
        const startList = helper.scratchRaceStartList(scores)
        const orderedScores = helper.orderByPlace(scores)
        this.setState({
           scores: orderedScores,
           scoresList: startList,
           eliminatedCounter: orderedScores.length,
        })
    })
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(null)
  }

  render() {
    const { omniumId, activeTab, isStartList } = this.props
    const { races,
            scores,
            cyclists,
            scoresList,
            eliminatedCounter,
            } = this.state
    const { category } = this.props
    console.log(eliminatedCounter)
    console.log(category)
    return (
      <div className="space-from-top">
       { localStorage.getItem('activeTab') === '33' && (
        <ul className="list-group list-group-flush ">
          {
            isStartList ? (
            scoresList &&  scoresList.map((score, id) => (
              <EliminationItemEdit
                key={`${score.id}${Math.random()}`}
                score={score}
                eventId={this.props.omniumId}
                user={this.props.user}
                rankId={id}
                isStartList={this.props.isStartList}
                category={this.state.category}
                eliminateCyclist={this.eliminateCyclist}
              />
            ))
          ) : (
            scores &&  scores.map((score, id) => (
              <EliminationItemEdit
                key={`${score.id}${Math.random()}`}
                score={score}
                eventId={this.props.omniumId}
                user={this.props.user}
                rankId={id}
                isStartList={this.props.isStartList}
                category={this.state.category}
                eliminateCyclist={this.eliminateCyclist}
              />
            ))
          )
          }
      </ul>
      )}
      </div>
    )
  }
}

export default EliminationEdit

