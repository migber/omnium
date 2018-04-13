
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './scratch.css'
import raceApi from './api'
import api from './components/scratchItem/api'
import ScratchItemEdit from './components/scratchItem/scratchItemEdit'
import helper from '../helper'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { changeFinishOrder, reorder } from './helper'

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

class ScratchEdit extends Component {
  constructor(props){
    super(props)
    this.state = {
      menScores: null,
      raceId: null,
      eventName: null,
      eventId:props.omniumId,
      cyclists: null,
      raceOrder: 1,
      category: null,
      womenScores: null,
      menScoresStartList: null,
      womenStartList: null,
      render: false
    }
    this.onDragEnd = this.onDragEnd.bind(this)
    this.addTwenty = this.addTwenty.bind(this)
    this.subtractTwenty = this.subtractTwenty.bind(this)
    this.handleChangeDNS = this.handleChangeDNS.bind(this)
    this.handleChangeDNQ = this.handleChangeDNQ.bind(this)
    this.handleChangeDNF = this.handleChangeDNF.bind(this)
    this.changeFinishOrder = this.changeFinishOrder.bind(this)
    this.apiListRequest = this.apiListRequest.bind(this)
    this.saveFinishPlaces = this.saveFinishPlaces.bind(this)
  }

  saveFinishPlaces(active){
    console.log('Best I can do ')
    console.log(this.state.menScores)
    const updatedScores = changeFinishOrder(this.state.menScores)
    let scoresD
    let races
    switch (active) {
      case 11:
        races = 1
        break;
      case 22:
        races = 2
        break
      case 33:
        races = 3
        break
      case 44:
        races = 4
        break
      default:
        break;
    }
    updatedScores.forEach((score) => {
      raceApi.updateScore(this.props.user, this.state.omniumId, races, score.id, score).then(() => {})
    })
    this.props.saveFinishPlaces(active)
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const menScores = reorder(
      this.state.menScores,
      result.source.index,
      result.destination.index
    );

    this.setState({
      menScores,
    });
  }

  changeFinishOrder(e){
    this.setState({
      finishPlace: e.target.value
    })
    const score = {
      finishPlace: e.target.value
    }
    if (e.target.value) {
      api.updateCyclistFinisPlace(this.props.user, this.state.eventId, 1, this.state.scoreId, score).then(() => {})
    }
    console.log(e.target.value)
  }

  addTwenty(scoreId) {
    console.log('add 20')
    console.log(scoreId)
    api.addTwenty(this.props.user, this.state.eventId, 1, scoreId).then((score) => {
      console.log(score.totalPoints)
      console.log(`Score id:${scoreId} was updated Got + 20 `)
      this.apiListRequest(localStorage.getItem('category'))
    })
  }

  subtractTwenty(scoreId) {
    console.log(scoreId)
    api.subtractTwenty(this.props.user, this.state.eventId, 1, scoreId).then((score) => {
      console.log(`Score id:${scoreId} was updated Got - 20 `)
      console.log(score.totalPoints)
      this.apiListRequest(localStorage.getItem('category'))
    })
  }

  apiListRequest(category){
    console.log('apiList')
    const path = `/events/${this.props.omniumId}/races/1`
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      path,
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
    api.updateDNS(this.props.user, this.state.eventId, 1, scoreId).then(() => {
      this.apiListRequest(localStorage.getItem('category'))
    })
  }

  handleChangeDNQ(scoreId) {
    api.updateDNQ(this.props.user, this.state.eventId, 1, scoreId).then(() => {
      this.apiListRequest(localStorage.getItem('category'))
    })
  }

  handleChangeDNF(scoreId) {
    console.log('DNF')
    api.updateDNF(this.props.user, this.state.eventId, 1, scoreId).then(() => {
      console.log('hererere')
      this.apiListRequest(localStorage.getItem('category'))
    })
  }

  componentDidMount() {
    console.log('ScratchInsideEDIt')
    localStorage.setItem('activeTab', 11)
    this.setState({ eventName: localStorage.getItem('eventName')})
    this.setState({
      category: localStorage.getItem('category')
    })
    console.log(this.props.location.pathname)
    const path = `/events/${this.props.omniumId}/races/1`
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      path,
      localStorage.getItem('category'),
     ).then( scores => {
      const startList = helper.scratchRaceStartList(scores)
      this.setState({ menScores: scores, menScoresStartList: startList})
    })
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      path,
      'women'
     ).then( scores => {
      const startList = helper.scratchRaceStartList(scores)
      this.setState({ womenScores: scores, womenStartList: startList })
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
       { localStorage.getItem('activeTab') === '11' && (
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
        <td className="txt-big text">{score.Cyclist.uciCode}</td>
        <td className="txt-big text">{score.Cyclist.nationality}</td>
        {
          !isStartList && (
            <td className="">
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
              <div class="inp-size input-group">
                <input type="number" value={score.finishPlace} class="txt-inside bord inp-size" onChange={this.changeFinishOrder}/>
              </div>
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
                    checked={score.dns}
                    onChange={() => this.handleChangeDNS(score.id)}
              />
            </td>
          )
        }
        {
          !isStartList && (
            <td className="contact-selector">
              <input type="checkbox"
                    checked={score.dnq}
                    onChange={() => this.handleChangeDNQ(score.id)}
              />
            </td>
          )
        }
        {
          !isStartList && (
            <td className="contact-selector">
              <input type="checkbox"
                    checked={score.dnf}
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
        <a id="saveResults" role="button" type="button" className={(activeTab === 'men') ? "choice-btn-active btn btn-default" : "choice-btn btn btn-default"} onClick={() => this.saveFinishPlaces(activeTab)} name="men">Save Results</a>
      </div>
      </div>

    )
  }
}

export default ScratchEdit

