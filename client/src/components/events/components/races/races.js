
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './race.css'
import helper from './helper'
import foto from '../../../../images/countries/ltu.png'
import matchFlag from '../helpers/flagMatcher'
import TopRiders from '../topRidersList/topRidersList'
import api from './api'
import Scratch from './Scratch/scratch'
import TempoRace from './tempoRace/tempoRace'
import Elimination from './elimination/elimination'
import PointRace from './pointRace/pointRace'

class Race extends Component {
  constructor(props){
    super(props)
    this.state = {
      races: null,
      raceId: null,
      eventName: null,
      activeTab: 0,
      omniumId: null,
      scores: null,
      isStartList: false,
      btnActive: 'men',
      startListScores: null,
      listScores: null,
    }
    this.setActiveClass = this.setActiveClass.bind(this)
    this.changeStartListState = this.changeStartListState.bind(this)
    this.setCategory = this.setCategory.bind(this)
    this.getWomenData = this.getWomenData.bind(this)
    this.getOmniumData = this.getOmniumData.bind(this)
    this.setStartListValueInStorage = this.setStartListValueInStorage.bind(this)
    this.changeList = this.changeList.bind(this)
    this.createListOfData = this.createListOfData.bind(this)
  }

  componentWillMount() {
    this.props.notShowEvents()
    this.setState({ eventName: localStorage.getItem('eventName')})
    this.setState({ omniumId: localStorage.getItem('omniumId')})
    api.getRaces(this.props.user, this.props.location.pathname ).then( races => {
      this.setState({ races })
    })
    api.getScoresOfSpecificRace(
      this.props.user,
      localStorage.getItem('omniumId'),
      this.state.activeTab,
      this.state.btnActive,
    )
    .then(scores => {
      this.setState({ scores, listScores: scores })
      this.setStartListValueInStorage()
      this.createListOfData(scores)
    })
  }

  createListOfData(scores){
    if (localStorage.getItem('isStartList') === 'true'){
      const startList = helper.CreateStartList(scores)
      this.setState({ scores: helper.finishOrder(startList),
         listScores: helper.finishOrder(scores),
         startListScores: startList })
    } else {
      this.setState({ scores: helper.finishOrder(scores),
         listScores: helper.finishOrder(scores)})
    }
  }

  setStartListValueInStorage(){
    if (localStorage.getItem('isStartList')) {
      if (localStorage.getItem('isStartList') === 'true') {
        localStorage.setItem('isStartList', true)
      } else {
        localStorage.setItem('isStartList', false)
      }
    }
  }

  changeStartListState(){
    if (localStorage.getItem('isStartList') === 'true') {
      this.setState({ scores: this.state.listScores })
      console.log('Changed to false')
      localStorage.setItem('isStartList', false)
      this.setState({isStartList: false}) }
    else {
      const startListScores = helper.CreateStartList(this.state.scores)
      this.setState({ scores: startListScores, startListScores })
      localStorage.setItem('isStartList', true)
      this.setState({isStartList: true})
    }
  }

  setActiveClass(id){
    this.setState({activeTab: id})
    localStorage.setItem('activeTab', id)
    this.props.history.push(`/events/${this.state.omniumId}/races/${id}`)
  }

  setCategory(cat){
    this.setState({ category: cat })
  }

  getOmniumData(category){
    if (category === 'women'){
      this.getWomenData(category)
    } else {
      api.getScoresOfSpecificRace(
        this.props.user,
        localStorage.getItem('omniumId'),
        this.state.activeTab,
        category,
      ).then(scores => {
        this.createListOfData(scores)
        const startList = helper.CreateStartList(scores)
        this.setState({ scores: startList })
      })
    }
  }

  getWomenData(category){
    api.getScoresOfSpecificRace(
      this.props.user,
      localStorage.getItem('omniumId'),
      this.state.activeTab,
      category,
    ).then(scores => {
      this.createListOfData(scores)
    })
  }

  changeList(category){
    console.log("buttonClicked")
    this.setState({ btnActive: category })
    this.getOmniumData(category)
  }

  render() {
    const { races, activeTab, omniumId, scores, btnActive} = this.state
    const active = localStorage.getItem('activeTab')
    const isStartList = localStorage.getItem('isStartList') == 'true' ? true : false
    return (
      <div className="main-container container">
      <h2> {this.state.eventName} </h2>
      <div className="space-from-top left-half">
      <ul className="nav nav-tabs">
      <li className={(active === '0') ? "active" : ""} role="presentation"><a onClick={() => this.setActiveClass(0)}>Overall</a></li>
      <li className={(active === '1') ? "active" : ""} role="presentation"> <a onClick={() => this.setActiveClass(1)}> Scratch </a></li>
      <li className={(active === '2') ? "active" : ""} role="presentation"> <a onClick={() => this.setActiveClass(2)}> Tempo race </a></li>
      <li className={(active=== '3') ? "active" : ""} role="presentation"> <a onClick={() => this.setActiveClass(3)}> Elimination </a></li>
      <li className={(active === '4') ? "active" : ""} role="presentation"> <a onClick={() => this.setActiveClass(4)}> Point race </a></li>
      </ul>
      <div>
        <div className="half total-marging-left">
          <input id="link" className="check-box form-check-input"
            name="startList" type="checkbox" checked={isStartList} onChange={this.changeStartListState}/>
          <label className="form-check-label">Start list</label>
       </div>
        <div className="smal-div left-marging space-from-top btn-group" role="group" aria-label="...">
          <button id="men" type="button" className={(btnActive === 'men') ? "choice-btn-active btn btn-default" : "choice-btn btn btn-default"} onClick={() => this.changeList('men')} name="men">Men</button>
          <button id="women" type="button" className={(btnActive === 'women') ? "choice-btn-active btn btn-default" : "choice-btn btn btn-default"} onClick={() => this.changeList('women')} name="women">Women</button>
      </div>
      </div>
      { localStorage.getItem('activeTab') === '0' && (
        <div className="space-from-top">
         <table className="table table-striped">
         <thead>
        {
          !isStartList ? (
            <tr >
              <th scope="col">Rank</th>
              <th scope="col">No</th>
              <th scope="col">Name</th>
              <th scope="col">Nationality</th>
              <th scope="col">Scratch</th>
              <th scope="col">Tempo race</th>
              <th scope="col">Elimination</th>
              <th scope="col">Point race</th>
              <th scope="col">Total points</th>
           </tr>
          ) : (
            <tr >
            <th scope="col">No</th>
            <th scope="col">Name</th>
            <th scope="col">Nationality</th>
         </tr>
          )
        }
         </thead>
         <tbody>
         { scores && scores.map(function(score, id) {
            return (
               !isStartList ? (
                <tr key={id} className="left">
                { score.dns && (
                  <th key={id} scope="row">DNS</th>
                )}
                { score.dnf && (
                  <th key={id} scope="row">DNF</th>
                )}
                { score.dnq && (
                  <th key={id} scope="row">DNQ</th>
                )}
                { !score.dnq && !score.dns && !score.dnf && (
                  <th key={id} scope="row">{id + 1}</th>
                )}
                <td>{score.raceNumber}</td>
                <td> {score.Cyclist.firstName} {score.Cyclist.lastName}</td>
                {/* <div className="inline"> */}
                <td>{score.Cyclist.nationality}</td>
                {/* <img className="img-circle " src={foto}/> */}
                {/* </div> */}
                <td>Scratch points</td>
                <td>Tempo points</td>
                <td>Elimination points</td>
                <td>Point Race points</td>
                <td>{score.totalPoints}</td>
                </tr>
              ) : (
                <tr key={id} className="left">
                <td>{score.raceNumber}</td>
                <td> {score.Cyclist.firstName} {score.Cyclist.lastName}</td>
                <td>{score.Cyclist.nationality}</td>
                {/* <span className="inline">

                  <img className="img-circle " src={foto}/>
                </span> */}
                </tr>
              )
          )})}
         </tbody>
         </table>
         </div>
      )}
      <div>
        <Route
          exact path={`${this.props.match.path}/1`}
          render={( props ) =>
            <Scratch
            {...props}
            user={this.props.user}
            omniumId={this.state.omniumId}
            activeTab={this.state.activeTab}
            category={this.state.btnActive}
            />
          }
        />
        <Route
          exact path={`${this.props.match.path}/2`}
          render={( props ) =>
            <TempoRace
            {...props}
            user={this.props.user}
            omniumId={this.state.omniumId}
            activeTab={this.state.activeTab}
            />
          }
        />
        <Route
          exact path={`${this.props.match.path}/3`}
          render={( props ) =>
            <Elimination
            {...props}
            user={this.props.user}
            omniumId={this.state.omniumId}
            activeTab={this.state.activeTab}
            />
          }
        />
        <Route
          exact path={`${this.props.match.path}/4`}
          render={( props ) =>
            <PointRace
            {...props}
            user={this.props.user}
            omniumId={this.state.omniumId}
            activeTab={this.state.activeTab}
            />
          }
        />
      </div>
      </div>
      <TopRiders  user={this.props.user}/>
      </div>
    )
  }
}

export default Race

