
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './tempoRace.css'
import raceApi from '../api'
import scratchApi from '../Scratch/components/scratchItem/api'
import api from './api'
import helper from '../helper'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { changeFinishOrder, reorder } from '../Scratch/helper'
import sprintsNumbers from './constants/sprints'

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? '#F2F1EF' : '#BDC3C7',
  'border-radius': '5px',
})

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  'border-radius': '5px',
  background: isDragging ? '#BDC3C7' : '#ECF0F1',
  ...draggableStyle,
})

class TempoEdit extends Component {
  constructor(props){
    super(props)
    this.state = {
      menScores: null,
      raceId: null,
      eventName: null,
      eventId:props.omniumId,
      raceOrder: 2,
      category: null,
      womenScores: null,
      menScoresStartList: null,
      womenStartList: null,
      sprints: null,
    }
    this.onDragEnd = this.onDragEnd.bind(this)
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
  }

  componentDidMount() {
    console.log('TempoItemDelete')
    localStorage.setItem('activeTab', 22)
    this.setState({ eventName: localStorage.getItem('eventName')})
    this.setState({
      category: localStorage.getItem('category')
    })
    api.getScoresOfSpecificRaceWIthoutDNX(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      'men',
     ).then( scores => {
      const startList = helper.scratchRaceStartList(scores)
      this.setState({ menScores: scores, menScoresStartList: startList})
    })
    api.getScoresOfSpecificRaceWIthoutDNX(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      'women'
     ).then( scores => {
      const startList = helper.scratchRaceStartList(scores)
      this.setState({ womenScores: scores, womenStartList: startList })
    })
    this.createSprints(localStorage.getItem('category'))
  }

  addSprint(scoreId, sprintId) {
    const sprint = {
      sprintNumber: sprintId,
      sprintPoints: 1,
    }
    api.addSprint(this.props.user, this.state.eventId, this.state.raceOrder, scoreId, sprint).then(() => {
      this.apiListRequest(localStorage.getItem('category'))
    })
  }

  saveFinishPlacesInside(){
    const active = localStorage.getItem('activeTab')
    const updatedScores = changeFinishOrder(this.state.menScores)
    this.props.saveFinishPlaces(updatedScores, this.state.raceOrder, 'men')
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    const menScores = reorder(
      this.state.menScores,
      result.source.index,
      result.destination.index
    )
    this.setState({
      menScores,
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
      switch (category) {
        case 'men':
          this.setState({ menScores: scores, menScoresStartList: startList})
          break;
        default:
          this.setState({ womenScores: scores, womenStartList: startList})
          break;
      }
    })
  }

  handleChangeDNS(scoreId) {
    console.log('DNS')
    scratchApi.updateDNS(this.props.user, this.state.eventId, 2, scoreId).then(() => {
      this.apiListRequest(localStorage.getItem('category'))
    })
  }

  handleChangeDNQ(scoreId) {
    console.log('DNQ')
    scratchApi.updateDNQ(this.props.user, this.state.eventId, 2, scoreId).then(() => {
      this.apiListRequest(localStorage.getItem('category'))
    })
  }

  handleChangeDNF(scoreId) {
    console.log('DNF')
    scratchApi.updateDNF(this.props.user, this.state.eventId, 2, scoreId).then(() => {
      console.log('hererere')
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
          sprintNumber: 0,
          sprintPoints: 1,
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


  render() {
    const { omniumId, activeTab, isStartList } = this.props
    const { races,
      scores,
      cyclists,
      menScores,
      womenScores,
      menScoresStartList,
      womenStartList,
      sprints  } = this.state
    const category = localStorage.getItem('category')
    return (
      <div className="space-from-top">
       { localStorage.getItem('activeTab') === '22' && (
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
            <th scope="col">Sprints</th>
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
          menScores &&  menScores.map((score, id) => (
            <Draggable key={score.id} draggableId={score.id} index={id}>
            {(provided, snapshot) => (
              <tr
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
        <td className="inblock contact-selector">
        { !isStartList && sprints && sprints.map((sprint, id) => (
              <label key={`${id}${Math.random()}`} className="lbl-text">{id + 1}
               <input type="checkbox"
                    key={`${id}${Math.random()}`}
                    checked={this.handleCheck(id+1, score) ? true : false}
                    onChange={() => this.addSprint(score.id, (id + 1))}
              />
              </label>
          ))
        }
        </td>
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
       <div>
        <a id="saveResults" role="button" type="button" className={(activeTab === 'men') ? "choice-btn-active btn btn-default" : "choice-btn btn btn-default"} onClick={() => this.saveFinishPlacesInside(activeTab)} name="men">Save Results</a>
      </div>
      </div>

    )
  }
}

export default TempoEdit

