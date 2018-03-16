import React, { Component } from 'react'
import Moment from 'moment'
import { Navbar, Button } from 'react-bootstrap'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import './events.css'
import api from './api'
import Races from './components/races/races'

class Event extends Component {
  constructor(props){
    super(props)
    this.state = {
      omniumId: null,
      omniums: null,
      eventName: null,
      date: null,
      show: true,
    }
    this.setEventData = this.setEventData.bind(this)
    this.notShowEvents = this.notShowEvents.bind(this)
  }

  componentWillMount() {
    api.getEvents(this.props.user).then( omniums => this.setState({ omniums }))
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

  render() {
    const { omniums, show } = this.state
    return (
      <div className="container">
      { show && (
        <h2> Events </h2>
      )}
      { omniums ? (
          <ul className="list-group list-group-flush ">
          { omniums.map((omnium) => {
              return (
                show &&
                <a key={omnium.id} onClick={() => this.setEventData(omnium.name, omnium.date, omnium.id)} className="list-group-item list-group-item-action list-group-item-primary"> { omnium.name } {Moment(omnium.date).format('YYYY-MM-YY')}</a>
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
     </div>
    )
  }
}

export default Event;

