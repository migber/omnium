
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './scratch.css'
import raceApi from './api'
import api from '../api'
import ScratchItem from './components/scratchItem/scratchItem'
import helper from '../helper'
import scratchItemApi from './components/scratchItem/api'

class Scratch extends Component {
  constructor(props){
    super(props)
    this.state = {
      race: null,
      scores: null,
      raceId: null,
      eventName: null,
      cyclists: null,
      raceOrder: 1,
      category: null,
      scoresList: null,
    }
    this.changeList = this.changeList.bind(this)
  }

  componentWillMount() {
    this.props.notShowEvents()
    localStorage.setItem('activeTab', 1)
    console.log(this.props.location.pathname)
    api.getRaces(this.props.user, this.props.location.pathname ).then((race) => {
      this.setState({ race })
    })
    this.setState({ eventName: localStorage.getItem('eventName')})
    this.setState({
      category: localStorage.getItem('category')
    })
    scratchItemApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      localStorage.getItem('category'),
     ).then((scores) => {
        const startList = helper.scratchRaceStartList(scores)
        const orderedScores = helper.finishOrder(scores)
        this.setState({ scores: orderedScores, scoresList: startList})
    })
  }

  changeList(category){
    scratchItemApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      category,
     ).then((scores) => {
        const startList = helper.scratchRaceStartList(scores)
        const orderedScores = helper.finishOrder(scores)
        this.setState({
           scores: orderedScores,
           scoresList: startList,
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
            race,
          } = this.state
    const category = localStorage.getItem('category')
    console.log(race)
    return (
      <div className="space-from-top">
       { localStorage.getItem('activeTab') === '1' && (
        <div>
          {
            race && (
              <article>
              <h4>{race.description}</h4>
              <p>Elapsed time: {race.elapsedTime}</p>
              <p>Average speed: {race.elapsedTime} km/h</p>
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
        {
          isStartList ? (
            scoresList &&  scoresList.sort((a, b) => a.raceNumber - b.raceNumber).map((score, id) => (
              <ScratchItem
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
              <ScratchItem
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

export default Scratch

