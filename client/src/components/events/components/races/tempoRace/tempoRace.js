
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './tempoRace.css'
import api from './api'
import raceApi from '../Scratch/api'
import raceHelper from '../helper'
import mainRaceApi from '../api'
import helper from './helper'
import TempoItem from './components/tempoItem'
import ScratchItemAPI from '../Scratch/components/scratchItem/api'

class TempoRace extends Component {
  constructor(props){
    super(props)
    this.state = {
      scores: null,
      race: null,
      raceId: null,
      eventName: null,
      cyclists: null,
      raceOrder: 2,
      omniumOverall: 0,
      category: null,
      startList: null,
    }
  }

  componentWillMount() {
    this.props.notShowEvents()
    localStorage.setItem('activeTab', 2)
    this.setState({ eventName: localStorage.getItem('eventName')})
    mainRaceApi.getRaces(this.props.user, this.props.location.pathname ).then((race) => {
      this.setState({ race })
    })
    this.setState({
      category: localStorage.getItem('category')
    })
    ScratchItemAPI.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      localStorage.getItem('category'),
     ).then((scores) => {
        const orderedScores = raceHelper.finishOrder(scores)
        this.setState({ scores: orderedScores})
    })
    ScratchItemAPI.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.omniumOverall,
      localStorage.getItem('category'),
     ).then((scores) => {
        const startList = helper.orderByTotalPoints(scores)
        this.setState({ startList})
    })
  }

  changeList(category){
    ScratchItemAPI.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      category,
     ).then((scores) => {
        const startList = raceHelper.scratchRaceStartList(scores)
        const orderedScores = raceHelper.finishOrder(scores)
        this.setState({
           scores: orderedScores,
           startList,
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
            menScores,
            startList,
            race,
          } = this.state
    const category = localStorage.getItem('category')
    console.log(race)
    return (
      <div className="space-from-top">
       { localStorage.getItem('activeTab') === '2' && (
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
              <th scope="col">Nationality</th>
              <th scope="col">Sprints won</th>
              <th scope="col">Finish place</th>
              <th scope="col">+</th>
              <th scope="col">-</th>
              <th scope="col">Total points</th>
              </tr>
            )
          }
        </thead>
        <tbody>
        {
          isStartList ? (
            startList &&  startList.map((score, id) => (
              <TempoItem
                key={`${score.id}${Math.random()}`}
                score={score}
                eventId={this.state.eventId}
                user={this.props.user}
                rankId={id}
                isStartList={this.props.isStartList}
                category={this.state.category}
                race={this.state.race}
              />
            ))
          ) : (
            scores && scores.map((score, id) => (
              <TempoItem
                key={`${score.id}${Math.random()}`}
                score={score}
                eventId={this.state.eventId}
                user={this.props.user}
                rankId={id}
                isStartList={this.props.isStartList}
                category={this.state.category}
                race={this.state.race}
              />
            ))
          )
        }
          </tbody>
        </table>
      )}
      </div>
    )
  }
}

export default TempoRace

