import React, { Component } from 'react'
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from "react-bootstrap"
import Moment from 'moment'
import api from './api'

class AddEventItem extends Component {
  constructor(props){
    super(props)
    this.state = {
      eventName: null,
      startDate: null,
      endDate: null,
      description: null,
    }
    this.createEvent = this.createEvent.bind(this)
    this.handleEventName = this.handleEventName.bind(this)
    this.handleStartDate = this.handleStartDate.bind(this)
    this.handleEndDate = this.handleEndDate.bind(this)
    this.handleDescription = this.handleDescription.bind(this)
  }

  createEvent() {
    const event = {
     name: this.state.eventName,
     startDate: this.state.startDate,
     endDate: this.state.endDate,
     description: this.state.description,
    }
    api.createEvent(this.props.user, event, this.state.description).then(() => {
      console.log('event was created')
    })
    this.props.action()
  }

  handleEventName(e){
    this.setState({
      eventName: e.target.value
    })
  }

  handleStartDate(e){
    this.setState({
      startDate: e.target.value
    })
  }

  handleEndDate(e){
    this.setState({
      endDate: e.target.value
    })
  }

  handleDescription(e){
    this.setState({
      description: e.target.value
    })
  }

  render() {
    const { eventName,
            startDate,
            endDate,
            description,
          } = this.state
    return (
      <form>
      <FormGroup controlId="formFirstName" >
      <ControlLabel>Event name</ControlLabel>
      <FormControl
        type="text"
        value={eventName}
        placeholder="Enter name"
        onChange={this.handleEventName}
      />
      <FormControl.Feedback />
      </FormGroup>

      <FormGroup controlId="formFirstName" >
      <ControlLabel>Description (organizers)</ControlLabel>
      <FormControl
        type="text"
        value={description}
        placeholder="Enter description"
        onChange={this.handleDescription}
      />
      <FormControl.Feedback />
      </FormGroup>

      <FormGroup controlId="formLastName">
      <ControlLabel>Start date</ControlLabel>
      <FormControl
        type="date"
        value={startDate}
        placeholder="Enter text"
        onChange={this.handleStartDate}
      />
      <FormControl.Feedback />
      </FormGroup>

      <FormGroup controlId="uciCode" >
      <ControlLabel>End date</ControlLabel>
      <FormControl
        type="date"
        value={endDate}
        placeholder="Enter text"
        onChange={this.handleEndDate}
      />
      <FormControl.Feedback />
      </FormGroup>

      <Button onClick={this.props.onCloseButtonClick}>Close</Button>
      <Button onClick={() => this.createEvent()} bsStyle="primary">Save changes</Button>
      </form>
    )
  }
}

export default AddEventItem