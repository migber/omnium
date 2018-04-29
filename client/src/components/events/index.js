import React, { Component } from 'react'
import Moment from 'moment'
import { Navbar, Button } from 'react-bootstrap'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import './events.css'
import api from './api'
import Races from './components/races/races'
import { VIP_EMAIL } from '../../config/env'
import { Modal } from "react-bootstrap"
import AddEventItem from './addEvent'

class Event extends Component {
  constructor(props){
    super(props)
    this.state = {
      omniumId: null,
      omniums: null,
      eventName: null,
      date: null,
      show: props.show,
      addEvent: false,
      lastEventId: null,
      omniumsLength: null,
    }
    this.setEventData = this.setEventData.bind(this)
    this.notShowEvents = this.notShowEvents.bind(this)
    this.addNewEvent = this.addNewEvent.bind(this)
    this.onCloseButtonClick = this.onCloseButtonClick.bind(this)
    this.onSaveButtonClick = this.onSaveButtonClick.bind(this)
    this.isEventFinished = this.isEventFinished.bind(this)
  }
  componentWillMount() {
    console.log('omniummmmm')
    const countEvents = []
    localStorage.setItem('activeTab', 0)
    api.getEvents(this.props.user).then((omniums) => {
      this.setState({ omniums })
      if (omniums) {
        this.setState({
          lastEventId: omniums[omniums.length -1].id,
          omniumsLength: omniums.length -1,
        })
      }
    }
    )
  }

  setEventData(name, date, id) {
    this.setState({eventName: name, date, omniumId: id,  show: false})
    localStorage.setItem('eventName', JSON.stringify(name))
    localStorage.setItem('omniumId', JSON.stringify(id))
    this.props.history.push(`/events/${id}/races`)
  }

  notShowEvents(){
    this.setState({show: false})
  }

  addNewEvent(){
    this.setState({
      addEvent: true
    })
  }

  onSaveButtonClick(){
    this.setState({
      addEvent: false,
    })
    window.location.reload()
  }

  onCloseButtonClick(){
    this.setState({
      addEvent: false
    })
  }

  isEventFinished(){
    const { omniums, lastEventId, omniumsLength } = this.state
    if (omniums) {
      if (lastEventId) {
        return omniums[omniumsLength].done
      }
    }
  }

  render() {
    const { omniums, show, addEvent } = this.state
    const { user } = this.props
    const activeTab = localStorage.getItem('activeTab') ? localStorage.getItem('activeTab') : 0
    return (
      <div className="container">
      { show && (
          <h2> Events </h2>
      )}
      {
        this.isEventFinished() ? (
            user.email == VIP_EMAIL && (
              <button className="btn-left upl-btn btn" type="submit" onClick={this.addNewEvent}>
              <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Create Event
              </button>
            )
        ) : (
          <div></div>
        )
      }
      { omniums ? (
          <ul className="list-group list-group-flush ">
          { omniums.map((omnium) => {
              return (
                show &&
                <a key={omnium.id} onClick={() => this.setEventData(omnium.name, omnium.date, omnium.id)} className="list-group-item list-group-item-action list-group-item-primary">
                 { omnium.name } ({Moment(omnium.startDate).format('YYYY-MM-YY')} - {Moment(omnium.endDate).format('YYYY-MM-YY')})</a>
              )
            })
          }
          </ul>
      ) : (
        <div>Loading </div>
        )
    }
     <div>
          <Route
            path={`${this.props.match.path}/:id/races`}
            render={( props ) =>
             <Races
                  {...props}
                  user={this.props.user}
                  omniumId={this.state.omniumId}
                  eventName={this.state.eventName}
                  date={this.state.date}
                  notShowEvents={this.notShowEvents}
              />
            }
          />
        </div>
        {
          addEvent && (
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Title>Add new event</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <AddEventItem user={this.props.user} auth={this.props.auth} onCloseButtonClick={this.onCloseButtonClick} action={this.onSaveButtonClick}/>
              </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
          </Modal.Dialog>
          )
        }
     </div>
    )
  }
}

export default Event;

