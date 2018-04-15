
import React, { Component } from 'react'
import CyclistModal from './cyclistModalScore'
import { Modal, PageHeader } from "react-bootstrap"
import { VIP_EMAIL } from '../../config/env'
import { Switch, Route } from 'react-router-dom'
import helper from './helper'
import './cyclists.css'
import api from './api'
import eventApi from '../events/api'

class Cyclists extends Component {
  constructor(props){
    super(props)
    this.state = {
      cyclists: null,
      btnActive: 'men',
      activeList: null,
      edit: false,
      cyclist: null,
      events: null,
      eventId: 1,
      selectedValue: 'Select race',
      raceOrder: 0,
    }

    this.changeList = this.changeList.bind(this)
    this.deleteCyclist = this.deleteCyclist.bind(this)
    this.onSaveButtonClick = this.onSaveButtonClick.bind(this)
    this.onCloseButtonClick = this.onCloseButtonClick.bind(this)
    this.editClick = this.editClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.findParticipants = this.findParticipants.bind(this)
    }

  componentWillMount() {
    eventApi.getEvents(this.props.user).then((events) => {
      this.setState({ events })
      if (events) {
        this.setState({
          eventId: events[events.length -1].id
        })
        this.findParticipants(events[events.length -1].id)
      }
    })
   }

  changeList(category){
    console.log("inside")
    localStorage.setItem('category', category)
    api.getScoresOverall(
      this.props.user,
      this.state.eventId,
      this.state.raceOrder,
      category,
    ).then((scores) => {
      console.log(scores)
      this.setState({cyclists: helper.sortByRaceNumber(scores)})
    })
  }

   deleteCyclist(id) {
    api.deleteCyclist(this.props.user, id).then(() => {
        console.log('User was deleted')
        window.location.reload()
    })
  }

  onSaveButtonClick(category){
    this.setState({
        edit: false,
        btnActive: category,
    })
    window.location.reload()
  }

  onCloseButtonClick(){
    this.setState({
      edit: false
    })
  }

  editClick(cyclist){
    this.setState({ edit: true, cyclist })
  }

  findParticipants(id){
    console.log(`Event id in find participants ${this.state.eventId}`)
    api.getScoresOverall(
      this.props.user,
      id,
      this.state.raceOrder,
      localStorage.getItem('category')
    ).then((scores) => {
      console.log(scores)
      this.setState({cyclists: helper.sortByRaceNumber(scores)})
    })
  }

  handleChange(event){
    this.setState({
      selectedValue: event.target.value,
      eventId: event.target.value
    })
    this.findParticipants(event.target.value)
  }

  render() {
    const { cyclists, btnActive, edit, events } = this.state
    const { user } = this.props
    return (
      <div className="container">
      <div className="row">
      <div className="listPosition col-sm-8">
      <div className="border-bottom" >
      <h1 className="display-3">Cyclists</h1>
      </div>
      <div className="smal-div left-marging space-from-top btn-group" role="group" aria-label="...">
          <button id="men" type="button" className={(btnActive === 'men') ? "choice-btn-active btn btn-default" : "choice-btn btn btn-default"} onClick={() => this.changeList('men')} name="men">Men</button>
          <button id="women" type="button" className={(btnActive === 'women') ? "choice-btn-active btn btn-default" : "choice-btn btn btn-default"} onClick={() => this.changeList('women')} name="women">Women</button>
      </div>
      <div className="space-top form-group">
          <select className="input-group" value={this.state.selectedValue} onChange={this.handleChange}>
          {
            events &&  events.map((event, i) => {
              return (
                <option id={event.id} value={event.id}> {event.name}</option>

              )
            } )
          }
      </select>
      </div>
      <table className="fit table">
      <thead className="text">
          <tr className="">
          <th>Race No</th>
          <th>First name</th>
          <th>Last name</th>
          <th>UCI Code</th>
          <th>Team</th>
          <th>Nationality</th>
          <th>Category</th>
          <th>b/k</th>
      </tr>
      </thead>
      { cyclists && cyclists.map((cyclist, index) => {
        return (
          <tbody className="text" key={cyclist.id}>
           <tr>
             <td className="raceNo">{cyclist.raceNumber}</td>
              <td>{cyclist.Cyclist.firstName}</td>
              <td>{cyclist.Cyclist.lastName}</td>
              <td> {cyclist.Cyclist.uciCode}</td>
              <td> {cyclist.Cyclist.team}</td>
              <td> {cyclist.Cyclist.nationality}</td>
              <td> {cyclist.Cyclist.category}</td>
              <span className={ cyclist.bk === false ? " " : "glyphicon glyphicon-ok"} aria-hidden="true"></span>
              <button onClick={() => this.deleteCyclist(cyclist.id)} type="button" className="btn-delete btn-float btn">Delete</button>
              <button key={cyclist.id} type="button" onClick={() => this.editClick(cyclist)} className="btn-edit btn-float btn btn">Edit</button>
          </tr>
           </tbody>
        )
      })
    }
</table>
      </div>
      </div>
      { edit && (
         <Modal.Dialog>
         <Modal.Header>
             <Modal.Title>Edit cyclist info</Modal.Title>
         </Modal.Header>
         <Modal.Body>
              <CyclistModal
              cyclist={this.state.cyclist}
              user={this.props.user} auth={this.props.auth}
              onCloseButtonClick={this.onCloseButtonClick}
              action={this.onSaveButtonClick}
              eventId={this.state.eventId}/>
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
    </Modal.Dialog>
      )}
      </div>
    )
  }
}

export default Cyclists

