
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './pointRace.css'
import api from './api'
import raceApi from '../api'
import helper from './helper'
import scratchIteamAPI from '../Scratch/components/scratchItem/api'
import raceHelper from '../helper'
import PointRaceItem from './components/pointraceItem'
import sprintsNumbers from './constants/sprints'
import { VIP_EMAIL } from '../../../../../config/env'

class PointRace extends Component {
  constructor(props){
    super(props)
    this.state = {
      scores: null,
      race: null,
      raceId: null,
      eventName: null,
      cyclists: null,
      raceOrder: 0,
      omniumOverall: 0,
      category: null,
      scoresList: null,
      womenStartList: null,
      menScoresStartList: null,
      sprints: null,
      elapsedTime: '',
      avgSpeed: 0,
      omniumId: this.props.omniumId,
      communique: '',
    }
    this.changeList = this.changeList.bind(this)
    this.createSprints = this.createSprints.bind(this)
    this.changeCommunique = this.changeCommunique.bind(this)
    this.changeAvgSpeed = this.changeAvgSpeed.bind(this)
    this.changeElapsedTime = this.changeElapsedTime.bind(this)
  }

  componentWillMount() {
    this.props.notShowEvents()
    localStorage.setItem('activeTab', 4)
    this.setState({ eventName: localStorage.getItem('eventName')})
    raceApi.getRaces(this.props.user, this.props.location.pathname ).then((race) => {
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
    scratchIteamAPI.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      localStorage.getItem('category'),
     ).then((scores) => {
        const orderedScores = raceHelper.omniumOrder(scores)
        this.setState({ scores: orderedScores})
        this.createSprints(localStorage.getItem('category'))
    })
    scratchIteamAPI.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.omniumOverall,
      localStorage.getItem('category'),
     ).then( scores => {
        const orderedScores = raceHelper.omniumOrder(scores)
        this.setState({ scoresList: orderedScores})
    })
  }

  changeList(category){
    scratchIteamAPI.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      category,
     ).then((scores) => {
        const startList = raceHelper.scratchRaceStartList(scores)
        const orderedScores = raceHelper.omniumOrder(scores)
        this.createSprints(localStorage.getItem('category'))
        this.setState({
           scores: orderedScores,
           scoresList: startList,
        })
    })
  }

  createSprints(category){
    const sprintsNumber = sprintsNumbers[category]
    let sprints = []
    if (sprintsNumber) {
      for (let i = 0; i < sprintsNumber; i++){
        const sprint = {
          sprintNumber: i+1,
          sprintPoints: 0,
        }
        sprints.push(sprint)
      }
      this.setState({
        sprints
      })
    }
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
      communique: ''
    }
    if (e.target.value) {
      data.communique = e.target.value
    }
    raceApi.updateCommunique(
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
    raceApi.updateElapsedTime(
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
    raceApi.updateAvgSpeed(
      this.props.user,
      this.state.omniumId,
      this.state.race.id,
      data
    ).then(() => {})
  }

  render() {
    const { omniumId, activeTab, isStartList, user } = this.props
    const { races,
            scores,
            cyclists,
            scoresList,
            race,
            sprints,
            elapsedTime,
            communique,
            avgSpeed,
            } = this.state
    const category = localStorage.getItem('category')
    console.log(race)
    return (
      <div className="space-from-top">
       { localStorage.getItem('activeTab') === '4' && (
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
              <th scope="col">UCI ID</th>
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
              {
                sprints && sprints.map((sprint, id) => (
                  <th key={`${sprint.id}${Math.random()}`} className="raceNo txt-big text">{sprint.sprintNumber}</th>
                ))
            }
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
            scoresList && scoresList.map((score, id) => (
              <PointRaceItem
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
              <PointRaceItem
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
      {
            this.props.user && this.props.user.email === VIP_EMAIL && (
              <div>
                <a href={`http://localhost:8080/api/events/${this.state.omniumId}/races/${this.state.raceOrder}/${this.state.category}/uciFile`} id="exportResults" role="button" type="button" className={(category === 'men') ? "choice-btn-active btn btn-default" : "choice-btn btn btn-default"} name="men">Download</a>
              </div>
            )
      }
      </div>
    )
  }
}

export default PointRace

