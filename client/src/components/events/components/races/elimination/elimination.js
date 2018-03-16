
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './elimination.css'
import api from './api'

class Elimination extends Component {
  constructor(props){
    super(props)
    this.state = {
      races: null,
      raceId: null,
      eventName: null,
    }
  }

  componentWillMount() {
    console.log(this.props)
    this.setState({ eventName: localStorage.getItem('eventName')})
    api.getRacesByCategory(this.props.user, this.props.location.pathname ).then( races => {
      this.setState({ races })
    })
  }

  render() {
    const { omniumId, activeTab } = this.props
    const { races } = this.state

    console.log(`Omnium id : ${omniumId}`)
    console.log('Races')
    console.log(races)
    return (
      <div className="space-from-top">
        { activeTab === 3 && (
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
        <td>elimination</td>
        <td>elimination</td>
        <td>elimination</td>
        <td>elimination</td>
        </tr>
        </tbody>
        </table>
         )}
        </div>

    )
  }
}

export default Elimination

