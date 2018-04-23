import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Modal } from "react-bootstrap"
import './assignNumbers.css'
import api from './api'
import Moment from 'moment'
// import CyclistModal from './cyclistModal'
import AssignNumbersItem from './components/assignNumberToCyclist'
import eventsApi from '../events/api'

class AssignNumbers extends Component {
    constructor(props){
        super(props)
        this.state = {
          scores: null,
          counter: 0,
          editBtn: false,
          deleteBtn: false,
          approveBtn: false,
          bk: false,
          edit: false,
          cyclist: null,
          cyclistsWomen: null,
          cyclistsMen: null,
          activeList: null,
          eventId: 1,
        }
        this.counter = this.counter.bind(this)
        this.renewScoresState = this.renewScoresState.bind(this)
      }

   componentWillMount() {
     this.renewScoresState()
   }

   renewScoresState(){
    eventsApi.getEvents(this.props.user).then((events) => {
      if (events) {
        this.setState({
          eventId: events[events.length-1].id
        })
        api.getScores(this.props.user, events[events.length-1].id).then((scores) => {
         this.setState({ scores })
         this.props.badgeSetAssign(this.props.user)
       })
      }
    })
   }

   counter(){
    const countTypes = []
       if (this.state.scores) {
        this.state.scores.map(function(req, i) {
            countTypes.push(req)
        })
       }
       this.props.badgeSet(countTypes.length)
    }

    render() {
        const { scores, deleteBtn, edit } = this.state
        console.log(scores)
        return (
            <div className="container">
            {
              scores ? (
                <div className="row">
                  <div className="listPosition col-sm-8">
                  <div className="border-bottom" >
                    <h1 className="display-3">Assign numbers</h1>
                  </div>
                  <table className="fit table table-striped">
                    <thead className="left">
                        <tr >
                        <th scope="col">Race number</th>
                        <th scope="col">First name</th>
                        <th scope="col">Last name</th>
                        <th scope="col">UCI Code</th>
                        <th scope="col">Team</th>
                        <th scope="col">Nationality</th>
                        <th scope="col">Category</th>
                    </tr>
                    </thead>
                    <tbody>
                    { scores && scores.map(score => (
                       <AssignNumbersItem
                          key={`${score.id}${Math.random()}`}
                          score={score}
                          eventId={this.state.eventId}
                          user={this.props.user}
                          renewScoresState={this.renewScoresState}
                          />
                    ))
                    }
                    </tbody>
                  </table>
                  </div>
            </div>
              ) : (
                <div>Loading</div>
              )
            }
            </div>
        )
    }
}

export default AssignNumbers