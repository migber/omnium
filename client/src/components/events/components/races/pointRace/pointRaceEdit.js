
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './pointRace.css'
import raceApi from '../api'
import scratchApi from '../Scratch/components/scratchItem/api'
import tempoApi from '../tempoRace/api'
import helper from '../helper'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { changeFinishOrder, reorder } from '../Scratch/helper'
import sprintsNumbers from './constants/sprints'
import api from './api'
import Sprint from './components/sprints/sprints'
import PointRaceSprintItem from './components/sprints/pointRaceItem'

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? '#F2F1EF' : '#BDC3C7',
  'borderRadius': '5px',
})

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  'borderRadius': '5px',
  background: isDragging ? '#BDC3C7' : '#ECF0F1',
  ...draggableStyle,
})

class PointRaceEdit extends Component {
  constructor(props){
    super(props)
    this.state = {
      scores: null,
      raceId: null,
      eventName: null,
      eventId:props.omniumId,
      raceOrder: 0,
      category: null,
      scoresList: null,
      sprints: null,
      activeSprint: 44,
      sprintOrder: 1,
    }
    this.onDragEnd = this.onDragEnd.bind(this)
    this.onDragEndSprints = this.onDragEndSprints.bind(this)
    this.addTwenty = this.addTwenty.bind(this)
    this.subtractTwenty = this.subtractTwenty.bind(this)
    this.handleChangeDNS = this.handleChangeDNS.bind(this)
    this.handleChangeDNQ = this.handleChangeDNQ.bind(this)
    this.handleChangeDNF = this.handleChangeDNF.bind(this)
    this.changeFinishOrder = this.changeFinishOrder.bind(this)
    this.apiListRequest = this.apiListRequest.bind(this)
    this.saveFinishPlacesInside = this.saveFinishPlacesInside.bind(this)
    this.createSprints = this.createSprints.bind(this)
    this.addSprint = this.addSprint.bind(this)
    this.handleCheck = this.handleCheck.bind(this)
    this.handleCheckedDNF = this.handleCheckedDNF.bind(this)
    this.handleCheckedDNS = this.handleCheckedDNS.bind(this)
    this.handleCheckedDNQ = this.handleCheckedDNQ.bind(this)
    this.changeList = this.changeList.bind(this)
    this.setActiveSprint = this.setActiveSprint.bind(this)
    this.addSprintsToRace = this.addSprintsToRace.bind(this)
    this.recalculateSprintsCounter = this.recalculateSprintsCounter.bind(this)
    this.setSprintsCounter = this.setSprintsCounter.bind(this)
  }

  componentWillMount() {
    console.log('TempoItemDelete')
    localStorage.setItem('activeTab', 44)
    this.setState({ eventName: localStorage.getItem('eventName')})
    this.setState({
      category: localStorage.getItem('category')
    })
    tempoApi.getScoresOfSpecificRaceWIthoutDNX(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      localStorage.getItem('category'),
     ).then((scores) => {
      const startList = helper.sortByRaceNumbers(scores)
      const sorted = helper.orderByPointsBigger(scores)
      this.setState({ scores: sorted, scoresList: startList})
      this.createSprints(localStorage.getItem('category'))
    })
  }

  addSprint(scoreId, sprintId) {
    const sprint = {
      sprintNumber: sprintId,
      sprintPoints: 1,
    }
    tempoApi.addSprint(this.props.user, this.state.eventId, this.state.raceOrder, scoreId, sprint).then(() => {
      this.apiListRequest(localStorage.getItem('category'))
    })
  }

  saveFinishPlacesInside(){
    console.log('updateFInishPlace inside')
    const active = localStorage.getItem('activeTab')
    const updatedScores = changeFinishOrder(this.state.scores)
    updatedScores.forEach((score, id) => {
        const sendThisScore = {
          finishPlace: score.finishPlace,
        }
        api.updateFinishPlace(
          this.props.user,
          this.props.omniumId,
          this.state.raceOrder,
          score.id,
          sendThisScore,
        ).then(() => {
          if (id+1 === updatedScores.length) {
            this.apiListRequest(localStorage.getItem('category'))
          }
        })
    })
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    const scores = reorder(
      this.state.scores,
      result.source.index,
      result.destination.index
    )
    this.setState({
      scores,
    })
  }

  onDragEndSprints(result) {
    if (!result.destination) {
      return;
    }
    const sprints = reorder(
      this.state.sprints,
      result.source.index,
      result.destination.index
    )
    this.setState({
      sprints,
    })
  }

  changeFinishOrder(e){
    this.setState({
      finishPlace: e.target.value
    })
    const score = {
      finishPlace: e.target.value
    }
    if (e.target.value) {
      scratchApi.updateCyclistFinisPlace(
        this.props.user,
        this.state.eventId,
        this.state.raceOrder,
        this.state.scoreId,
        score
      ).then(() => {})
    }
  }

  addSprintsToRace(scoreId) {
    const { sprints } = this.state
    for (let i = 0; i < sprints.length; i++) {
          const sprint = {
            sprintNumber: i+1,
            sprintPoints: 0
          }
          api.createSprints(
            this.props.user,
            this.props.omniumId,
            this.state.raceOrder,
            scoreId,
            sprint,
          ).then((sprint) => {
            this.apiListRequest(localStorage.getItem('category'))
          })
        }
  }

  addTwenty(scoreId) {
    scratchApi.addTwenty(this.props.user, this.state.eventId, this.state.raceOrder, scoreId).then((score) => {
      this.apiListRequest(localStorage.getItem('category'))
    })
  }

  subtractTwenty(scoreId) {
    scratchApi.subtractTwenty(this.props.user, this.state.eventId, this.state.raceOrder, scoreId).then((score) => {
      this.apiListRequest(localStorage.getItem('category'))
    })
  }

  apiListRequest(category){
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      category,
     ).then( scores => {
      const startList = helper.scratchRaceStartList(scores)
      const sorted = helper.orderByPointsBigger(scores)
      this.setState({ scores: sorted, scoresList: startList})
    })
  }

  handleChangeDNF(scoreId){
    scratchApi.updateDNF(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      scoreId,
    ).then((score) => {
      this.apiListRequest(localStorage.getItem('category'))
    })
  }

  handleChangeDNS(scoreId){
    scratchApi.updateDNS(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      scoreId,
    ).then((score) => {
      this.apiListRequest(localStorage.getItem('category'))
    })
  }

  handleChangeDNQ(scoreId){
    scratchApi.updateDNQ(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      scoreId,
    ).then((score) => {
      this.apiListRequest(localStorage.getItem('category'))
    })
  }

  createSprints(category){
    const sprintsNumber = sprintsNumbers[category]
    console.log(`Sprints number ${sprintsNumber}`)
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

  handleCheck(id, score) {
    return score.Sprints.some(item => id === item.sprintNumber)
  }

  handleCheckedDNF(score){
    return score.dnf
  }

  handleCheckedDNS(score){
    return score.dns
  }

  handleCheckedDNQ(score){
    return score.dnq
  }

  changeList(category){
    console.log("inside")
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      category,
     ).then((scores) => {
       console.log(scores)
        const startList = helper.scratchRaceStartList(scores)
        const orderedScores = helper.orderByPlace(scores)
        this.createSprints(localStorage.getItem('category'))
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

  setActiveSprint(id){
    this.setSprintsCounter()
    console.log(id)
    this.setState({
      activeSprint: id
    })
    this.apiListRequest(localStorage.getItem('category'))
  }

  recalculateSprintsCounter(){
    const order = this.state.sprintOrder
    this.setState({
      sprintOrder: order + 1
    })
  }

  setSprintsCounter(){
    console.log('set sprints counter')
    this.setState({
      sprintOrder: 1
    })
  }

  render() {
    const { omniumId, activeTab, isStartList } = this.props
    const { races,
      scores,
      cyclists,
      scoresList,
      sprints,
      activeSprint,
      } = this.state
      console.log(scoresList)
    const category = localStorage.getItem('category')
    return (
      <div className="space-from-top">

       <div>
       <ul className="nav nav-tabs">
       <li className={(activeSprint === 44) ? "active" : ""} role="presentation"> <a onClick={() => this.setActiveSprint(44)}> Race </a></li>
        {
           sprints && sprints.map((sprint, id) => (
            <li key={`${id}${Math.random()}${Math.random()}`} className={(activeSprint === id+1) ? "active" : ""} role="presentation"> <a onClick={() => this.setActiveSprint(id+1)}> {`${id+1} Sprint`} </a></li>
           ))
        }
       </ul>
     </div>
     <div>
     { localStorage.getItem('activeTab') === '44' &&
       activeSprint === 44 && (
        <table className="table table-striped">
        <thead>
        {
          isStartList ? (
            <tr >
            <th scope="col">Order</th>
            <th scope="col">No</th>
            <th scope="col">Name</th>
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
                  <td key={`${id}${Math.random()}${Math.random()}`}
                      className="raceNo txt-big text">
                      {sprint.sprintNumber}
                  </td>
                ))
            }
            <th scope="col">+20</th>
            <th scope="col">-20</th>
            <th scope="col">Finish place</th>
            <th scope="col">Total points</th>
            <th scope="col">DNS</th>
            <th scope="col">DNQ</th>
            <th scope="col">DNF</th>
            </tr>
          )
        }
      </thead>
         <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable className="dnd" droppableId="droppable">
            {(provided, snapshot) => (
              <tbody
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
       {
          scores && scores.map((score, id) => (
            <Draggable key={score.id} draggableId={score.id} index={id}>
            {(provided, snapshot) => (
              <tr
                key={`${score.id}${Math.random()}`}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(
                  snapshot.isDragging,
                  provided.draggableProps.style
                )}
              >
            {
          !isStartList && score.dns ? (
            <td className="txt-big text">DNS</td>
          ) : score.dnf ? (
            <td className="txt-big text">DNF</td>
          ) : score.dnq ? (
            <td className="txt-big text">DNQ</td>
          ) : (
            <td className="txt-big text">{id + 1}</td>
          )
        }
        <td className="raceNo txt-big text">{score.raceNumber}</td>
        <td className="txt-big text">{score.Cyclist.lastName} {score.Cyclist.firstName}</td>
        <td className="txt-big text">{score.Cyclist.nationality}</td>
        {
          score.Sprints.length !== 0 ? (
            score.Sprints && score.Sprints.sort((a, b) => a.sprintNumber > b.sprintNumber).map((sprint, id) => (
              sprint.sprintPoints === 0 ? (
                <td key={`${id}${Math.random()}`}
                    className="raceNo txt-big text">
                </td>
               ) : (
                  <td key={`${id}${Math.random()}`}>
                  {sprint.sprintPoints}
                  </td>
               )
            ))
          ): (
            <td>
            <a type="button" role="button" onClick={() => this.addSprintsToRace(score.id)} class="a-orange btn-small btn-group btn-group-xs btn-default" aria-label="Left Align">
              <span class="span-algn glyphicon glyphicon-pencil" aria-hidden="true"></span>
            </a>
          </td>
          )
        }
        {
          !isStartList && (
            <td>
              <a type="button" role="button" onClick={() => this.addTwenty(score.id)} class="a-green btn-small btn-group btn-group-xs btn-default" aria-label="Left Align">
                <span class="span-algn glyphicon glyphicon-plus" aria-hidden="true"></span>
              </a>
            </td>
            )
          }
        {
          !isStartList && (
            <td className="">
            <a type="button" role="button" onClick={() => this.subtractTwenty(score.id)} class="a-red btn-small btn-group btn-group-xs btn-default" aria-label="Left Align">
              <span class="span-algn glyphicon glyphicon-minus" aria-hidden="true"></span>
            </a>
          </td>
          )
        }
        {
          !isStartList && (
            <td className="txt-big text">
            {score.finishPlace}
            </td>
          )
        }
        {
          !isStartList && (
              <td className="txt-big text">{score.totalPoints}</td>
          )
        }
        {
          !isStartList && (
            <td className="contact-selector">
              <input type="checkbox"
                    checked={this.handleCheckedDNS(score) ? true : false}
                    onChange={() => this.handleChangeDNS(score.id)}
              />
            </td>
          )
        }
        {
          !isStartList && (
            <td className="contact-selector">
              <input type="checkbox"
                    checked={this.handleCheckedDNQ(score) ? true : false}
                    onChange={() => this.handleChangeDNQ(score.id)}
              />
            </td>
          )
        }
        {
          !isStartList && (
            <td className="contact-selector">
              <input type="checkbox"
                    checked={this.handleCheckedDNF(score) ? true : false}
                    onChange={() => this.handleChangeDNF(score.id)}
              />
            </td>
          )
        }
             </tr>
                  )}
        </Draggable>
          ))
        }
         {provided.placeholder}
      </tbody>
        )}
          </Droppable>
        </DragDropContext>
        </table>
          )}
      {
        activeSprint !== 44 && (
          <ul className="list-group list-group-flush ">
          {
            scoresList &&  scoresList.map((score, id) => (
              <PointRaceSprintItem
                activeSprint={this.state.activeSprint}
                score={score}
                isStartList={this.state.isStartList}
                eventId={this.props.omniumId}
                user={this.props.user}
                rankId={id}
                eliminateCyclist={this.eliminateCyclist}
                sprintOrder={this.state.sprintOrder}
                recalculateSprintsCounter={this.recalculateSprintsCounter}
              />
          )
       )
      }
      {/* <div>
        <a id="saveSprints" role="button" type="button" className={(activeTab === 'men') ? "choice-btn-active btn btn-default" : "choice-btn btn btn-default"} onClick={() => this.saveSprints(activeTab)}>Save Sprint</a>
      </div> */}
       </ul>
      )
      }
        </div>
        {
           activeSprint === 44 && (
            <div>
              <a id="saveResults" role="button" type="button" className={(activeTab === 'men') ? "choice-btn-active btn btn-default" : "choice-btn btn btn-default"} onClick={() => this.saveFinishPlacesInside(activeTab)}>Save Results</a>
            </div>
           )
        }
      </div>
    )
  }
}

export default PointRaceEdit

