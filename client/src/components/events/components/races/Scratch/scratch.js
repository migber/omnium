
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './scratch.css'
import raceApi from './api'
import ScratchItem from './components/scratchItem/scratchItem'
import helper from '../helper'

class Scratch extends Component {
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
    localStorage.setItem('activeTab', 1)
    this.setState({ eventName: localStorage.getItem('eventName')})
    this.setState({
      category: localStorage.getItem('category')
    })
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.location.pathname,
      localStorage.getItem('category'),
     ).then( scores => {
        console.log(scores)
        const startList = helper.scratchRaceStartList(scores)
        const orderedScores = helper.orderByPlace(scores)
        console.log(orderedScores)
        // this.props.updateOverallOmnium(scores)
        this.setState({ menScores: orderedScores, menScoresStartList: startList})
    })
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.location.pathname,
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
       { localStorage.getItem('activeTab') === '1' && (
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
        { category === 'men' ? (
          isStartList ? (
            menScoresStartList &&  menScoresStartList.map((score, id) => (
              <ScratchItem
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
              <ScratchItem
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
              <ScratchItem
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
              <ScratchItem
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

export default Scratch

