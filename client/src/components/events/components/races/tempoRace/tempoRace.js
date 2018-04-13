
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './tempoRace.css'
import api from './api'
import raceApi from '../Scratch/api'
import helper from './helper'
import raceHelper from '../helper'
import TempoItem from './components/tempoItem'

class TempoRace extends Component {
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
      womenStartList: null,
      menScoresStartList: null,
    }
  }

  componentWillMount() {
    localStorage.setItem('activeTab', 2)
    const raceBeforePath = '/events/10/races/1'
    this.setState({ eventName: localStorage.getItem('eventName')})
    this.setState({
      category: localStorage.getItem('category')
    })
    console.log(this.props.location.pathname)
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.location.pathname,
      'men',
     ).then( scores => {
        console.log(scores)
        const orderedScores = raceHelper.orderByPlace(scores)
        this.setState({ menScores: orderedScores})
    })
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      raceBeforePath,
      'men',
     ).then( scores => {
        console.log(scores)
        const startList = helper.orderByPoints(scores)
        this.setState({ menScoresStartList: startList})
    })
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.location.pathname,
      'women'
     ).then( scores => {
        const orderedScores = raceHelper.orderByPlace(scores)
        this.setState({ womenScores: orderedScores})
    })
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      raceBeforePath,
      'women'
     ).then( scores => {
        const startList = helper.orderByPoints(scores)
        this.setState({ womenStartList: startList})
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
    console.log(menScores)
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
        { category === 'men' ? (
          isStartList ? (
            menScoresStartList &&  menScoresStartList.map((score, id) => (
              <TempoItem
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
              <TempoItem
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
              <TempoItem
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
              <TempoItem
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

export default TempoRace

