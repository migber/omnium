import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import './requests.css'
import api from './api'
import Moment from 'moment'

class Requests extends Component {
    constructor(props){
        super(props)
        this.state = {
          requests: null,
          counter: 0,
        }
        this.counter = this.counter.bind(this)
      }

   componentWillMount() {
    api.getRequests(this.props.user).then( requests => {
        this.setState({ requests })
        this.counter()
    })
   }

   counter(){
    const countTypes = []
       if (this.state.requests) {
        this.state.requests.map(function(req, i) {
            countTypes.push(req)
        })
        console.log(countTypes.length)
       }
       this.props.badgeSet(countTypes.length)
   }

    render() {
        const { requests } = this.state
        console.log(requests)
        return (
            <div className="jumbotron container">
            <div className="row">
            <div className="listPosition col-sm-8">
            <h1 className="display-3">Requests</h1>
            <table className="table table-striped">
            <thead>
                <tr >
                <th scope="col">First name</th>
                <th scope="col">Last name</th>
                <th scope="col">UCI Code</th>
                <th scope="col">Team</th>
                <th scope="col">Nationality</th>
                <th scope="col">Birthday</th>
                <th scope="col">Category</th>
            </tr>
            </thead>
      { requests && requests.map((request) => {
              return (
                <tbody className="left">
                    <td>{request.firstName}</td>
                    <td>{request.lastName}</td>
                    <td> {request.uciCode}</td>
                    <td> {request.team}</td>
                    <td> {request.nationality}</td>
                    <td>{Moment(request.date).format('YYYY-MM-YY')}</td>
                    <td> {request.category}</td>
                    <button type="button" class="btn-approve btn-float btn btn-success">Approve</button>
                    <button type="button" class="btn-edit btn-float btn btn-success">Edit</button>
                 </tbody>
              )
            })
          }
    </table>
     <div>
          {/* <Route
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
          /> */}
        </div>
            </div>
            </div>
            </div>
        )
    }
}

export default Requests