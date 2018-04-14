
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import raceApi from '../../../api'
import api from '../api'
import PointRaceItemSprints from './pointRaceItem'
import helper from '../../../helper'
import { placePoints } from '../../../constants/constants'
import scratchItemApi from '../../../Scratch/components/scratchItem/api'
import tempoApi from '../../../tempoRace/api'

class Sprint extends Component {
  constructor(props){
    super(props)
    this.state = {
      scores: props.scores,
      raceOrder: 0,
      category: 'men',
      scoresList: props.scores,
      eliminatedCounter: null
    }
    this.eliminateCyclist = this.eliminateCyclist.bind(this)
    this.isDNX = this.isDNX.bind(this)
    this.calculateEliminatedCounter = this.calculateEliminatedCounter.bind(this)
    this.recalculateEliminatedCounter = this.recalculateEliminatedCounter.bind(this)
    this.handleChangeDNQ = this.handleChangeDNQ.bind(this)
    this.handleChangeDNF = this.handleChangeDNF.bind(this)
    this.handleChangeDNS = this.handleChangeDNS.bind(this)
    this.getListScores = this.getListScores.bind(this)
    this.saveFinishPlacesInside = this.saveFinishPlacesInside.bind(this)
  }

  componentWillMount() {
    this.props.notShowEvents()
    // localStorage.setItem('activeTab', 33)
    // this.setState({ eventName: localStorage.getItem('eventName')})
    // this.setState({
    //   category: localStorage.getItem('category')
    // })
    // tempoApi.getScoresOfSpecificRaceWIthoutDNX(
    //   this.props.user,
    //   this.props.omniumId,
    //   this.state.raceOrder,
    //   localStorage.getItem('category'),
    //  ).then((scores) => {
    //   const startList = helper.scratchRaceStartList(scores)
    //   this.setState({ scores, scoresList: startList})
    //   this.createSprints(localStorage.getItem('category'))
    // })
    // raceApi.getScoresOfSpecificRace(
    //   this.props.user,
    //   this.props.omniumId,
    //   this.state.raceOrder,
    //   localStorage.getItem('category'),
    //  ).then((scores) => {
    //     const startList = helper.scratchRaceStartList(scores)
    //     const orderedScores = helper.orderByPlace(scores)
    //     console.log(orderedScores)
    //     const eliminatedCounter = this.calculateEliminatedCounter(orderedScores).length
    //     this.setState({
    //        scores: orderedScores,
    //        scoresList: startList,
    //        eliminatedCounter
    //     })
    // })
  }

  calculateEliminatedCounter(scores){
    let notEliminated = []
    scores.forEach((score) => {
      if (score.points === 0 && !this.isDNX(score)) {
        notEliminated.push(score)
      }
    })
    return notEliminated
  }

  recalculateEliminatedCounter(){
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      localStorage.getItem('category'),
     ).then((scores) => {
      const eliminatedCounter = this.calculateEliminatedCounter(scores).length
      console.log(eliminatedCounter)
      this.setState({
        eliminatedCounter
      })
    })
  }

  isDNX(score){
    return (score.dns || score.dnq || score.dnf)
  }

  eliminateCyclist(scoreId){
    console.log(this.state.eliminatedCounter)
    console.log('eliminated')
    const scoreAttributes = {
      place: this.state.eliminatedCounter,
      points: placePoints[this.state.eliminatedCounter]
    }
    console.log(scoreAttributes)
    api.eliminateCyclist(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      scoreId,
      scoreAttributes,
    ).then((score) => {
      console.log('eliminateCyclist')
      console.log(score)
      raceApi.getScoresOfSpecificRace(
        this.props.user,
        this.props.omniumId,
        this.state.raceOrder,
        localStorage.getItem('category'),
       ).then((scores) => {
          const startList = helper.scratchRaceStartList(scores)
          const orderedScores = helper.orderByPlace(scores)
          const eliminatedCounter = this.calculateEliminatedCounter(orderedScores).length
          this.setState({
             scores: orderedScores,
             scoresList: startList,
             eliminatedCounter,
          })
      })
    })
  }

  getListScores() {
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      localStorage.getItem('category'),
     ).then((scores) => {
        const startList = helper.scratchRaceStartList(scores)
        const orderedScores = helper.orderByPlace(scores)
        console.log(orderedScores)
        const eliminatedCounter = this.calculateEliminatedCounter(orderedScores).length
        console.log(eliminatedCounter)
        this.setState({
           scores: orderedScores,
           scoresList: startList,
           eliminatedCounter
        })
    })
  }

  handleChangeDNF(raceOrder, scoreId){
    scratchItemApi.updateDNF(
      this.props.user,
      this.props.omniumId,
      raceOrder,
      scoreId,
    ).then((score) => {
      this.getListScores()
    })
  }

  handleChangeDNS(raceOrder, scoreId){
    scratchItemApi.updateDNS(
      this.props.user,
      this.props.omniumId,
      raceOrder,
      scoreId,
    ).then((score) => {
      this.getListScores()
    })
  }

  handleChangeDNQ(raceOrder, scoreId){
    scratchItemApi.updateDNQ(
      this.props.user,
      this.props.omniumId,
      raceOrder,
      scoreId,
    ).then((score) => {
      this.getListScores()
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

  saveFinishPlacesInside(){
    console.log('inside finish places')
    this.props.saveFinishPlacesElimination(this.state.scores, this.state.category)
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
    return (
      <div className="space-from-top">
       { localStorage.getItem('activeTab') === '44' && (
        <ul className="list-group list-group-flush ">
          {
            isStartList ? (
            scoresList &&  scoresList.map((score, id) => (
              <PointRaceItemSprints
                key={`${score.id}${Math.random()}`}
                score={score}
                eventId={this.props.omniumId}
                user={this.props.user}
                rankId={id}
                isStartList={this.props.isStartList}
                category={this.state.category}
                eliminateCyclist={this.eliminateCyclist}
                recalculateEliminatedCounter={this.recalculateEliminatedCounter}
                handleChangeDNS={this.handleChangeDNS}
                handleChangeDNF={this.handleChangeDNF}
                handleChangeDNQ={this.handleChangeDNQ}
              />
            ))
          ) : (
            scores && scores.map((score, id) => (
              <PointRaceItemSprints
                key={`${score.id}${Math.random()}`}
                score={score}
                eventId={this.props.omniumId}
                user={this.props.user}
                rankId={id}
                isStartList={this.props.isStartList}
                category={this.state.category}
                eliminateCyclist={this.eliminateCyclist}
                recalculateEliminatedCounter={this.recalculateEliminatedCounter}
                handleChangeDNS={this.handleChangeDNS}
                handleChangeDNF={this.handleChangeDNF}
                handleChangeDNQ={this.handleChangeDNQ}
              />
            ))
          )
          }
      </ul>
      )}
       <div>
        <a id="saveResults" role="button" type="button" className={(activeTab === 'men') ? "choice-btn-active btn btn-default" : "choice-btn btn btn-default"} onClick={() => this.saveFinishPlacesInside(activeTab)} name="men">Save Results</a>
      </div>
      </div>
    )
  }
}

export default Sprint

