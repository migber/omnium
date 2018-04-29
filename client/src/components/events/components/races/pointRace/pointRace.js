
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
    }
    this.changeList = this.changeList.bind(this)
    this.createSprints = this.createSprints.bind(this)
  }

  componentWillMount() {
    this.props.notShowEvents()
    localStorage.setItem('activeTab', 4)
    this.setState({ eventName: localStorage.getItem('eventName')})
    raceApi.getRaces(this.props.user, this.props.location.pathname ).then((race) => {
      this.setState({ race })
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

  render() {
    const { omniumId, activeTab, isStartList } = this.props
    const { races,
            scores,
            cyclists,
            scoresList,
            race,
            sprints,
            } = this.state
    const category = localStorage.getItem('category')
    console.log(race)
    return (
      <div className="space-from-top">
       { localStorage.getItem('activeTab') === '4' && (
         <div>
         {
           race && (
             <article>
             <h4>{race.description}</h4>
             <p>Elapsed time: {race.elapseTime}</p>
             <p>Average speed: {race.avgSpeed} km/h</p>
           </article>
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
           race && race.communique && (
             <article>
             <h4>Communique of commissaires:</h4>
             <p>{race.communique}</p>
           </article>
           )
         }
        </div>
      )}
      </div>
    )
  }
}

export default PointRace

