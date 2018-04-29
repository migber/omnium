
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
import { VIP_EMAIL } from '../../../../../config/env'

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
      elapsedTime: '',
      avgSpeed: 0,
      omniumId: this.props.omniumId,
      communique: '',
    }
    this.changeCommunique = this.changeCommunique.bind(this)
    this.changeAvgSpeed = this.changeAvgSpeed.bind(this)
    this.changeElapsedTime = this.changeElapsedTime.bind(this)
  }

  componentWillMount() {
    this.props.notShowEvents()
    localStorage.setItem('activeTab', 2)
    this.setState({ eventName: localStorage.getItem('eventName')})
    mainRaceApi.getRaces(
      this.props.user,
      this.props.location.pathname,
     ).then((race, err) => {
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
    this.setState({
      category: localStorage.getItem('category')
    })
    ScratchItemAPI.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      localStorage.getItem('category'),
     ).then((scores, err) => {
        const orderedScores = raceHelper.finishOrder(scores)
        this.setState({ scores: orderedScores})
    })
    ScratchItemAPI.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.omniumOverall,
      localStorage.getItem('category'),
     ).then((scores, err) => {
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
     ).then((scores, err) => {
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

  changeCommunique(e) {
    this.setState({
      communique: e.target.value
    })
    const data = {
      communique: e.target.value
    }
    if (e.target.value) {
      mainRaceApi.updateCommunique(
        this.props.user,
        this.state.omniumId,
        this.state.race.id,
        data
      ).then(() => {})
    }
  }

  changeElapsedTime(e) {
    console.log("ehehe")
    console.log(e.target.value)
    this.setState({
      elapsedTime: e.target.value
    })
    const data = {
      elapseTime: e.target.value
    }
    if (e.target.value) {
      mainRaceApi.updateElapsedTime(
        this.props.user,
        this.state.omniumId,
        this.state.race.id,
        data
      ).then(() => {
        console.log('ciaa')
      })
    }
  }

  changeAvgSpeed(e) {
    this.setState({
      avgSpeed: e.target.value
    })
    const data = {
      avgSpeed: e.target.value
    }
    if (e.target.value) {
      mainRaceApi.updateAvgSpeed(
        this.props.user,
        this.state.omniumId,
        this.state.race.id,
        data
      ).then(() => {})
    }
  }

  render() {
    const { omniumId, activeTab, isStartList, user } = this.props
    const { races,
            scores,
            cyclists,
            menScores,
            startList,
            race,
            elapsedTime,
            communique,
            avgSpeed,
          } = this.state
    const category = localStorage.getItem('category')
    console.log(race)
    return (
      <div className="space-from-top">
       { localStorage.getItem('activeTab') === '2' && (
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

export default TempoRace

