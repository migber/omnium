
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './race.css'
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
    }
    this.setActiveClass = this.setActiveClass.bind(this)
  }

  componentWillMount() {
    console.log(this.props)
    this.props.notShowEvents()
    this.setState({ eventName: localStorage.getItem('eventName')})
    this.setState({ omniumId: localStorage.getItem('omniumId')})
    api.getRaces(this.props.user, this.props.location.pathname ).then( races => {
      this.setState({ races })
    })
  }

  setActiveClass(id){
    this.setState({activeTab: id})
    this.props.history.push(`/events/${this.state.omniumId}/races/${id}`)
  }

  render() {
    const { races, activeTab, omniumId } = this.state

    console.log(`Omnium id : ${omniumId}`)
    console.log('Races')
    console.log(races)
    return (
      <div className="container">
      <h2> {this.state.eventName} </h2>
      <div className="space-from-top left-half">
      <ul className="nav nav-tabs">
      <li className={(this.state.activeTab === 0) ? "active" : ""} role="presentation"><a onClick={() => this.setActiveClass(0)}>Overall</a></li>
      <li className={(this.state.activeTab === 1) ? "active" : ""} role="presentation"> <a a onClick={() => this.setActiveClass(1)}> Scratch </a></li>
      <li className={(this.state.activeTab === 2) ? "active" : ""} role="presentation"> <a onClick={() => this.setActiveClass(2)}> Tempo race </a></li>
      <li className={(this.state.activeTab === 3) ? "active" : ""} role="presentation"> <a onClick={() => this.setActiveClass(3)}> Elimination </a></li>
      <li className={(this.state.activeTab === 4) ? "active" : ""} role="presentation"> <a onClick={() => this.setActiveClass(4)}> Point race </a></li>
      </ul>
      { activeTab === 0 && (
        <div className="space-from-top">
         <table className="table table-striped">
         <thead>
         <tr >
         <th scope="col">Rank</th>
         <th scope="col">No</th>
         <th scope="col">Name</th>
         <th scope="col">Nationality</th>
         <th scope="col">Total points</th>
         </tr>
         </thead>
         <tbody>
         <tr className="left">
         <th scope="row">1</th>
         <td>Mark</td>
         <td>Otto</td>
         <td>@mdo</td>
         <td>@mdo</td>
         </tr>
         </tbody>
         </table>
         </div>
      )}
      <div>
        <Route
          path={`${this.props.match.path}/1`}
          render={( props ) =>
            <Scratch
            {...props}
            user={this.props.user}
            omniumId={this.state.omniumId}
            activeTab={this.state.activeTab}
            />
          }
        />
        <Route
          path={`${this.props.match.path}/2`}
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
          path={`${this.props.match.path}/3`}
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
          path={`${this.props.match.path}/4`}
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
      <TopRiders />
      </div>
    )
  }
}

export default Race

