
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './elimination.css'
import raceApi from '../api'
import EliminationItem from './components/elimnationItem'
import helper from '../helper'
import api from '../api'
import { VIP_EMAIL } from '../../../../../config/env'

class Elimination extends Component {
  constructor(props){
    super(props)
    this.state = {
      scores: null,
      race: null,
      raceId: null,
      eventName: null,
      cyclists: null,
      raceOrder: 3,
      elapsedTime: '',
      avgSpeed: 0,
      omniumId: this.props.omniumId,
      communique: '',
      category: null,
      omniumOverall: 0,
      startList: null,
    }
    this.changeList = this.changeList.bind(this)
    this.changeCommunique = this.changeCommunique.bind(this)
    this.changeAvgSpeed = this.changeAvgSpeed.bind(this)
    this.changeElapsedTime = this.changeElapsedTime.bind(this)
  }

  componentWillMount() {
    this.props.notShowEvents()
    localStorage.setItem('activeTab', 3)
    this.setState({
      omniumId: localStorage.getItem('omniumId')
    })
    api.getRaces(this.props.user, this.props.location.pathname ).then((race) => {
      const elapsedTime =  race.elapseTime ? race.elapseTime : ''
      const avgSpeed =  race.avgSpeed ? race.avgSpeed : 0
      const communique =  race.communique ? race.communique : ''
      this.setState({
        race,
        elapsedTime,
        avgSpeed,
        communique,
       })
    })
    this.setState({ eventName: localStorage.getItem('eventName')})
    this.setState({
      category: localStorage.getItem('category')
    })
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.state.omniumId,
      this.state.raceOrder,
      localStorage.getItem('category'),
     ).then((scores) => {
        const orderedScores = helper.eliminationFinishOrder(scores)
        this.setState({ scores: orderedScores})
    })
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.state.omniumId,
      this.state.omniumOverall,
      localStorage.getItem('category'),
     ).then((scores) => {
        const startList = helper.orderByPointsBigger(scores)
        this.setState({ startList })
    })
  }

  changeCommunique(e) {
    this.setState({
      communique: e.target.value
    })
    const data = {
      communique: ''
    }
    if (e.target.value) {
      data.communique = e.target.value
    }
    api.updateCommunique(
      this.props.user,
      this.state.omniumId,
      this.state.race.id,
      data
    ).then(() => {})
  }

  changeElapsedTime(e) {
    this.setState({
      elapsedTime: e.target.value
    })
    let data = {
      elapseTime: ''
    }
    if (e.target.value) {
      data.elapseTime = e.target.value
    }
    api.updateElapsedTime(
      this.props.user,
      this.state.omniumId,
      this.state.race.id,
      data
    ).then(() => {})
  }

  changeAvgSpeed(e) {
    this.setState({
      avgSpeed: e.target.value
    })
    const data = {
      avgSpeed: ''
    }
    if (e.target.value) {
      data.avgSpeed = e.target.value
    }
    api.updateAvgSpeed(
      this.props.user,
      this.state.omniumId,
      this.state.race.id,
      data
    ).then(() => {})
  }

  changeList(category){
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.state.omniumId,
      this.state.raceOrder,
      category,
     ).then((scores) => {
        const orderedScores = helper.eliminationFinishOrder(scores)
        this.setState({
           scores: orderedScores,
           eliminatedCounter: orderedScores.length,
        })
    })
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.state.omniumId,
      this.state.omniumOverall,
      localStorage.getItem('category'),
     ).then((scores) => {
        const startList = helper.orderByPointsBigger(scores)
        this.setState({ startList })
    })
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(null)
  }

  render() {
    const { omniumId, activeTab, isStartList, user } = this.props
    const { races,
            scores,
            cyclists,
            menScores,
            womenScores,
            startList,
            race,
            elapsedTime,
            communique,
            avgSpeed,
            womenStartList  } = this.state
    const category = localStorage.getItem('category')
    return (
      <div className="space-from-top">
       { localStorage.getItem('activeTab') === '3' && (
         <div>
         {
           race && (
               (user && user.email === VIP_EMAIL) ? (
                <article>
                <h4>{race.description}</h4>
                  <div className="center inp-size input-group">
                    <label>Elapsed time: </label>
                    <input type="text" value={elapsedTime} className="txt-inside bord" onChange={this.changeElapsedTime}/>
                    <label>Average Speed: </label>
                    <input type="number" value={avgSpeed} className="txt-inside bord" onChange={this.changeAvgSpeed}/>
                  </div>
                </article>
               ) : (
                <article>
                <h4>{race.description}</h4>
                <p>Elapsed time: {race.elapseTime}</p>
                <p>Average speed: {race.avgSpeed} km/h</p>
                </article>
               )
           )
         }
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
        {
          isStartList ? (
            startList && startList.map((score, id) => (
              <EliminationItem
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
            scores &&  scores.map((score, id) => (
              <EliminationItem
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
        {
           race && (
            (user && user.email === VIP_EMAIL) ? (
              <article>
               <p>Communique of commissaires:</p>
               <input type="text" value={communique} className="comm" onChange={this.changeCommunique}/>
            </article>
            ) : (
              <article>
                <h4>Communique of commissaires:</h4>
                <p>{race.communique}</p>
              </article>
            )

           )
         }
        </div>
      )}
      </div>
    )
  }
}

export default Elimination

