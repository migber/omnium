
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './elimination.css'
import raceApi from '../api'
import EliminationItem from './components/elimnationItem'
import helper from '../helper'
import api from '../api'

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
      category: null,
      omniumOverall: 0,
      startList: null,
    }
    this.changeList = this.changeList.bind(this)
  }

  componentWillMount() {
    this.props.notShowEvents()
    localStorage.setItem('activeTab', 3)
    api.getRaces(this.props.user, this.props.location.pathname ).then((race) => {
      this.setState({ race })
    })
    this.setState({ eventName: localStorage.getItem('eventName')})
    this.setState({
      category: localStorage.getItem('category')
    })
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      localStorage.getItem('category'),
     ).then((scores) => {
        const orderedScores = helper.eliminationFinishOrder(scores)
        this.setState({ scores: orderedScores})
    })
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.omniumOverall,
      localStorage.getItem('category'),
     ).then((scores) => {
        const startList = helper.orderByPointsBigger(scores)
        this.setState({ startList })
    })
  }

  changeList(category){
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
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
      this.props.omniumId,
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
    const { omniumId, activeTab, isStartList } = this.props
    const { races,
            scores,
            cyclists,
            menScores,
            womenScores,
            startList,
            race,
            womenStartList  } = this.state
    const category = localStorage.getItem('category')
    console.log(race)
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
      )}
      </div>
    )
  }
}

export default Elimination

