
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
import ScratchEdit from './Scratch/scratchEdit'
import { VIP_EMAIL } from '../../../../config/env'
import placePoints from './constants/constants'
import OmniumItem from '../OmniumListItem/omniumItem'
import scratchApi from './Scratch/api'
import TempoRaceEdit from './tempoRace/tempoEdit'
import EliminationEdit from './elimination/eliminationEdit'
import PointRaceEdit from './pointRace/pointRaceEdit'

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
      scratchScoresStartList: null,
      eliminationScoresStartList: null,
      tempoRaceScoresStartList: null,
      pointRaceScoresStartList: null,
      scratchScores: null,
      eliminationScores: null,
      tempoRaceScores: null,
      pointRaceScores: null,
    }
    this.setActiveClass = this.setActiveClass.bind(this)
    this.changeStartListState = this.changeStartListState.bind(this)
    this.setCategory = this.setCategory.bind(this)
    this.getWomenData = this.getWomenData.bind(this)
    this.getOmniumData = this.getOmniumData.bind(this)
    this.setStartListValueInStorage = this.setStartListValueInStorage.bind(this)
    this.changeList = this.changeList.bind(this)
    this.createListOfData = this.createListOfData.bind(this)
    this.saveFinishPlaces = this.saveFinishPlaces.bind(this)
    this.updateOverallOmnium = this.updateOverallOmnium.bind(this)
    this.saveFinishPlacesElimination = this.saveFinishPlacesElimination.bind(this)
  }

  componentWillMount() {
    this.props.notShowEvents()
    if (localStorage.getItem('category')) {
      localStorage.setItem('category', 'men')
    } else {
      localStorage.setItem('category', localStorage.getItem('category'))
    }
    this.setState({ eventName: localStorage.getItem('eventName')})
    this.setState({ omniumId: localStorage.getItem('omniumId')})
    api.getRaces(this.props.user, this.props.location.pathname ).then((races) => {
      this.setState({ races })
    })
    api.getScoresOfSpecificRace(
      this.props.user,
      localStorage.getItem('omniumId'),
      this.state.activeTab,
      this.state.btnActive,
    )
    .then((scores) => {
      this.setStartListValueInStorage()
      this.createListOfData(scores)
      console.log(scores)
    })
  }

  createListOfData(scores){
    if (localStorage.getItem('isStartList') === 'true'){
      console.log('true')
      const startList = helper.CreateStartList(scores)
      this.setState({ scores: helper.finishOrder(startList),
         listScores: helper.omniumOrder(scores),
         startListScores: helper.CreateStartList(startList) })
    } else {
      console.log('else')
      console.log(scores)
      this.setState({ scores: helper.omniumOrder(scores),
         listScores: helper.CreateStartList(scores)})
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
      this.setState({ scores: helper.omniumOrder(this.state.listScores) })
      console.log('Changed to false')
      localStorage.setItem('isStartList', false)
      this.setState({isStartList: false})
    } else {
      const startListScores = helper.CreateStartList(this.state.scores)
      this.setState({ scores: helper.omniumOrder(startListScores), startListScores })
      localStorage.setItem('isStartList', true)
      this.setState({isStartList: true})
    }

  }

  updateOverallOmnium(scores, category){
    console.log('update omnium overall')
    if (scores) {
      let scoreP
      const sortedScores = helper.omniumOrder(scores)
      sortedScores.forEach((scoreP, index) => {
        console.log(scoreP)
        const data = {
          score: {
            CyclistId: scoreP.CyclistId,
            uciId: scoreP.Cyclist.uciCode,
            raceNumber: scoreP.raceNumber,
            points: scoreP.points,
            finishPlace: scoreP.finishPlace,
            place: scoreP.place,
            positionBefore: (index + 1),
          },
          category: category,
        }
        api.updateTotalScoresOmniumOverall(this.props.user, this.state.omniumId, data).then((score) => {
        })
      })
    }
  }

  setActiveClass(id){
    this.setState({activeTab: id})
    const { btnActive } = this.state
    console.log(id)
    localStorage.setItem('activeTab', id)
    console.log('set active class')
    api.getScoresOfSpecificRace(
      this.props.user,
      localStorage.getItem('omniumId'),
      id,
      btnActive,
    ).then(scores => {
      console.log(scores)
      const startListScores = helper.CreateStartList(scores)
      const order = helper.omniumOrder(scores)
      this.setState({
        scores: order,
        startListScores,
      })
    })
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
        this.setState({ scores: helper.omniumOrder(scores), startList })
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

  changeList(category) {
    console.log(`From storage ${localStorage.getItem('category')}`)
    this.setState({ btnActive: category })
    localStorage.setItem('category', category)
    console.log(localStorage.getItem('activeTab'))
    console.log(localStorage.getItem('activeTab') !== '0')
    if (localStorage.getItem('activeTab') !== '0'){
      this.child.changeList(category)
    }
    this.getOmniumData(category)
  }

  saveFinishPlaces(scores, activeTab, category) {
    console.log('finsihplacesss')
    let scoresD
    scoresD = scores
    const updatedScores = helper.calculateFinalRaceOrder(scoresD)
    this.updateOverallOmnium(updatedScores, category)
    updatedScores.forEach((score) => {
      scratchApi.updateScore(this.props.user, this.state.omniumId, activeTab, score.id, score).then(() => {})
    })
  }

  saveFinishPlacesElimination(scores, category){
    console.log('races finish places')
    this.updateOverallOmnium(scores, category)
  }

  render() {
    const { races, activeTab, omniumId, scores, btnActive} = this.state
    console.log(localStorage.getItem('activeTab'))
    const active = localStorage.getItem('activeTab') ? Number(localStorage.getItem('activeTab')) : activeTab
    const isStartList = localStorage.getItem('isStartList') == 'true' ? true : false
    return (
      <div className="main-container container">
      <h2> {this.state.eventName} </h2>
      <div className={(active === 11 || active === 22 || active === 33 || active === 44 ) ? "space-from-top" : "space-from-top left-half"}>
      <ul className="nav nav-tabs">
      <li className={(active === 0) ? "active" : ""} role="presentation"><a onClick={() => this.setActiveClass(0)}>Overall</a></li>
      <li className={(active === 1) ? "active" : ""} role="presentation"> <a onClick={() => this.setActiveClass(1)}> Scratch </a></li>
      {
        this.props.user && this.props.user.email === VIP_EMAIL && (
          <li className={(active === 11) ? "com-edit active" : "com-edit"} role="presentation">
             <a onClick={() => this.setActiveClass(11)}> Scratch <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
             </a>
          </li>
        )
      }
      <li className={(active === 2) ? "active" : ""} role="presentation"> <a onClick={() => this.setActiveClass(2)}> Tempo race </a></li>
      {
        this.props.user && this.props.user.email === VIP_EMAIL && (
          <li className={(active === 22) ? "com-edit active" : "com-edit"} role="presentation">
            <a onClick={() => this.setActiveClass(22)}> Tempo race <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
            </a>
         </li>
        )
      }
      <li className={(active === 3) ? "active" : ""} role="presentation"> <a onClick={() => this.setActiveClass(3)}> Elimination </a></li>
     {
        this.props.user && this.props.user.email === VIP_EMAIL && (
          <li className={(active === 33) ? "com-edit active" : "com-edit"} role="presentation">
            <a onClick={() => this.setActiveClass(33)}> Elimination <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
            </a>
          </li>
        )
     }
      <li className={(active === 4) ? "active" : ""} role="presentation"> <a onClick={() => this.setActiveClass(4)}> Point race </a></li>
      {
        this.props.user && this.props.user.email === VIP_EMAIL && (
          <li className={(active === 44) ? "com-edit active" : "com-edit"} role="presentation">
            <a onClick={() => this.setActiveClass(44)}> Point race <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
            </a>
          </li>
        )
      }
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
         <table className="table-responsive table table-striped">
         <thead>
        {
          !isStartList ? (
            <tr >
              <th scope="col">Rank</th>
              <th scope="col">No</th>
              <th scope="col">Name</th>
              <th scope="col">UCI ID</th>
              <th scope="col">Nationality</th>
              <th scope="col">Scratch</th>
              <th scope="col">Tempo race</th>
              <th scope="col">Elimination</th>
              <th scope="col">Total points</th>
           </tr>
          ) : (
            <tr >
            <th scope="col"></th>
            <th scope="col">No</th>
            <th scope="col">Name</th>
            <th scope="col">UCI ID</th>
            <th scope="col">Nationality</th>
         </tr>
          )
        }
         </thead>
         <tbody>
         { scores && scores.map((score, id) => {
            return (
              <OmniumItem
              key={`${score.id}${Math.random()}`}
              user={this.props.user}
              score={score}
              rankId={id}
              eventId={this.state.omniumId}
              activeTab={this.state.activeTab}
              isStartList={this.state.isStartList}
              updateOverallOmnium={this.updateOverallOmnium}
              />
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
            onRef={ref => (this.child = ref)}
            user={this.props.user}
            omniumId={this.state.omniumId}
            activeTab={this.state.activeTab}
            isStartList={this.state.isStartList}
            updateOverallOmnium={this.updateOverallOmnium}
            notShowEvents={this.props.notShowEvents}
            />
          }
        />
        <Route
          exact path={`${this.props.match.path}/11`}
          render={( props ) =>
            <ScratchEdit
            {...props}
            onRef={ref => (this.child = ref)}
            user={this.props.user}
            omniumId={this.state.omniumId}
            activeTab={this.state.activeTab}
            isStartList={this.state.isStartList}
            saveFinishPlaces={this.saveFinishPlaces}
            notShowEvents={this.props.notShowEvents}
            />
          }
        />
        <Route
          exact path={`${this.props.match.path}/2`}
          render={( props ) =>
            <TempoRace
            {...props}
            onRef={ref => (this.child = ref)}
            user={this.props.user}
            omniumId={this.state.omniumId}
            activeTab={this.state.activeTab}
            isStartList={this.state.isStartList}
            notShowEvents={this.props.notShowEvents}
            />
          }
        />
         <Route
          exact path={`${this.props.match.path}/22`}
          render={( props ) =>
            <TempoRaceEdit
            {...props}
            onRef={ref => (this.child = ref)}
            user={this.props.user}
            omniumId={this.state.omniumId}
            activeTab={this.state.activeTab}
            isStartList={this.state.isStartList}
            saveFinishPlaces={this.saveFinishPlaces}
            notShowEvents={this.props.notShowEvents}
            />
          }
        />
        <Route
          exact path={`${this.props.match.path}/3`}
          render={( props ) =>
            <Elimination
            {...props}
            onRef={ref => (this.child = ref)}
            user={this.props.user}
            omniumId={this.state.omniumId}
            activeTab={this.state.activeTab}
            isStartList={this.state.isStartList}
            saveFinishPlaces={this.saveFinishPlaces}
            notShowEvents={this.props.notShowEvents}
            />
          }
        />
        <Route
          exact path={`${this.props.match.path}/33`}
          render={( props ) =>
            <EliminationEdit
            {...props}
            onRef={ref => (this.child = ref)}
            user={this.props.user}
            omniumId={this.state.omniumId}
            category={this.state.btnActive}
            activeTab={this.state.activeTab}
            isStartList={this.state.isStartList}
            saveFinishPlaces={this.saveFinishPlaces}
            notShowEvents={this.props.notShowEvents}
            saveFinishPlacesElimination={this.saveFinishPlacesElimination}
            />
          }
        />
        <Route
          exact path={`${this.props.match.path}/4`}
          render={( props ) =>
            <PointRace
            {...props}
            onRef={ref => (this.child = ref)}
            user={this.props.user}
            omniumId={this.state.omniumId}
            category={this.state.btnActive}
            activeTab={this.state.activeTab}
            isStartList={this.state.isStartList}
            saveFinishPlaces={this.saveFinishPlaces}
            notShowEvents={this.props.notShowEvents}
            />
          }
        />
         <Route
          exact path={`${this.props.match.path}/44`}
          render={( props ) =>
            <PointRaceEdit
            {...props}
            onRef={ref => (this.child = ref)}
            user={this.props.user}
            omniumId={this.state.omniumId}
            category={this.state.btnActive}
            activeTab={this.state.activeTab}
            isStartList={this.state.isStartList}
            saveFinishPlaces={this.saveFinishPlaces}
            notShowEvents={this.props.notShowEvents}
            />
          }
        />
      </div>
      </div>
      {
        (active !== 11 &&  active !== 22 && active !== 33 && active !== 44) ? (
          <TopRiders  user={this.props.user}/>
        ) : (
          <div>
            {/* <a id="saveResults" role="button" type="button" className={(btnActive === 'men') ? "choice-btn-active btn btn-default" : "choice-btn btn btn-default"} onClick={() => this.saveFinishPlaces(active)} name="men">Save Results</a> */}
          </div>
        )
      }
      </div>
    )
  }
}

export default Race

