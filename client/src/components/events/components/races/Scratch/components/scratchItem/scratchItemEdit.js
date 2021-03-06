import React, { Component } from 'react'
import api from './api'
import './item.css'
import openSocket from 'socket.io-client'
import { Droppable, Draggable } from 'react-beautiful-dnd'

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: 17 * 2,
  margin: `0 0 ${17}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

class ScratchItemEdit extends Component {
  constructor(props){
    super(props)
    const { score, eventId, rankId } = props
    this.state = {
      raceOrder: 1,
      rankId: rankId,
      raceNumber: score.raceNumber,
      eventId: eventId,
      scoreId: score.id,
      bk: score.bk,
      dns: score.dns,
      dnf: score.dnf,
      dnq: score.dnq,
      positionBefore: score.positionBefore,
      lapPlusPoints: score.lapPlusPoints,
      lapMinusPoints: score.lapMinusPoints,
      points: score.points,
      finishPlace: score.finishPlace,
      place: score.place,
      totalPoints: score.totalPoints,
      firstName: score.Cyclist.firstName,
      lastName: score.Cyclist.lastName,
      uciCode: score.Cyclist.uciCode,
      nationality: score.Cyclist.nationality,
    }

    this.changeFinishOrder = this.changeFinishOrder.bind(this)
    this.addTwenty = this.addTwenty.bind(this)
    this.subtractTwenty = this.subtractTwenty.bind(this)
    this.addMessage = this.addMessage.bind(this)
    this.handleChangeDNS = this.handleChangeDNS.bind(this)
    this.handleChangeDNQ = this.handleChangeDNQ.bind(this)
    this.handleChangeDNF = this.handleChangeDNF.bind(this)
  }

  addMessage(data){
    this.setState({totalPoints: data.totalPoints})
  }

  updateRaceNumber() {
    const score = {
      raceNumber: this.state.raceNumber,
      eventId: this.state.eventId
    }
    api.updateCyclistRaceNumber(
      this.props.user,
      this.state.eventId,
      this.state.scoreId,
      score,
    ).then(() => {})
  }

  changeFinishOrder(e){
    this.setState({
      finishPlace: e.target.value
    })
    const score = {
      finishPlace: e.target.value
    }
    if (e.target.value) {
      api.updateCyclistFinisPlace(
        this.props.user,
        this.state.eventId,
        this.state.raceOrder,
        this.state.scoreId,
        score).then(() => {})
    }
  }

  addTwenty() {
    api.addTwenty(
      this.props.user,
      this.state.eventId,
      this.state.raceOrder,
      this.state.scoreId,
    ).then((score) => {
      this.setState({
        totalPoints: score.totalPoints
      })
    })
  }

  subtractTwenty() {
    api.subtractTwenty(
      this.props.user,
      this.state.eventId,
      this.state.raceOrder,
      this.state.scoreId,
    ).then((score) => {
      this.setState({
        totalPoints: score.totalPoints
      })
    })
  }

  handleChangeDNS() {
    this.setState({
      dns: !this.state.dns
    })
    api.updateDNS(this.props.user, this.state.eventId, 1, this.state.scoreId).then(() => {})
  }

  handleChangeDNQ() {
    this.setState({
      dnq: !this.state.dnq
    })
    api.updateDNQ(this.props.user, this.state.eventId, 1, this.state.scoreId).then(() => {})
  }

  handleChangeDNF() {
    this.setState({
      dnf: !this.state.dnf
    })
    api.updateDNF(this.props.user, this.state.eventId, 1, this.state.scoreId).then(() => {})
  }

  render() {
    const {
      rankId,
      raceNumber,
      scoreId,
      bk,
      dns,
      dnf,
      dnq,
      positionBefore,
      lapPlusPoints,
      lapMinusPoints,
      points,
      finishPlace,
      place,
      totalPoints,
      firstName,
      lastName,
      uciCode,
      nationality,
    } = this.state
    const { isStartList } = this.props
    return (
      <div className="tr-size">
        {
          !isStartList && dns ? (
            <td className="txt-big text">DNS</td>
          ) : dnf ? (
            <td className="txt-big text">DNF</td>
          ) : dnq ? (
            <td className="txt-big text">DNQ</td>
          ) : (
            <td className="txt-big text">{rankId + 1}</td>
          )
        }
        <td className="raceNo txt-big text">{raceNumber}</td>
        <td className="txt-big text">{lastName} {firstName}</td>
        <td className="txt-big text">{uciCode}</td>
        <td className="txt-big text">{nationality}</td>
        {
          !isStartList && (
            <td className="">
              <a type="button" role="button" onClick={() => this.addTwenty()} class="a-green btn-small btn-group btn-group-xs btn-default" aria-label="Left Align">
                <span class="span-algn glyphicon glyphicon-plus" aria-hidden="true"></span>
              </a>
            </td>
            )
          }
        {
          !isStartList && (
            <td className="">
            <a type="button" role="button" onClick={() => this.subtractTwenty()} class="a-red btn-small btn-group btn-group-xs btn-default" aria-label="Left Align">
              <span class="span-algn glyphicon glyphicon-minus" aria-hidden="true"></span>
            </a>
          </td>
          )
        }
        {
          !isStartList && (
            <td className="txt-big text">
              <div class="inp-size input-group">
                <input type="number" value={finishPlace} class="txt-inside bord inp-size" onChange={this.changeFinishOrder}/>
              </div>
            </td>
          )
        }
        {
          !isStartList && (
              <td className="txt-big text">{totalPoints}</td>
          )
        }
        {
          !isStartList && (
            <td className="contact-selector">
              <input type="checkbox"
                    checked={this.state.dns}
                    onChange={this.handleChangeDNS}
              />
            </td>
          )
        }
        {
          !isStartList && (
            <td className="contact-selector">
              <input type="checkbox"
                    checked={this.state.dnq}
                    onChange={this.handleChangeDNQ}
              />
            </td>
          )
        }
        {
          !isStartList && (
            <td className="contact-selector">
              <input type="checkbox"
                    checked={this.state.dnf}
                    onChange={this.handleChangeDNF}
              />
            </td>
          )
        }
    </div>
    )
  }
}

export default ScratchItemEdit