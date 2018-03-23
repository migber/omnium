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
          editBtn: false,
          deleteBtn: false,
          approveBtn: false,
        }
        this.counter = this.counter.bind(this)
        this.deleteCyclist = this.deleteCyclist.bind(this)
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

   deleteCyclist(id) {
       console.log(id)
       api.deleteCyclist(this.props.user, id).then(() => {
           console.log('User was deleted')
           window.location.reload()
       })
   }

    render() {
        const { requests, deleteBtn } = this.state
        console.log(deleteBtn)
        return (
            <div className="container">
            <div className="row">
            <div className="listPosition col-sm-8">
            <h1 className="display-3">Requests</h1>
            <table className="fit table table-striped">
            <thead className="left">
                <tr >
                <th scope="col">Race number</th>
                <th scope="col">First name</th>
                <th scope="col">Last name</th>
                <th scope="col">UCI Code</th>
                <th scope="col">Team</th>
                <th scope="col">Nationality</th>
                <th scope="col">Birthday</th>
                <th scope="col">Category</th>
                <th scope="col">B/K</th>
            </tr>
            </thead>
      { requests && requests.map((request) => {
              return (
                <tbody className="left">
                   <input type="number" className="inp-size form-control"/>
                    <td>{request.firstName}</td>
                    <td>{request.lastName}</td>
                    <td> {request.uciCode}</td>
                    <td> {request.team}</td>
                    <td> {request.nationality}</td>
                    <td>{Moment(request.date).format('YYYY-MM-YY')}</td>
                    <td> {request.category}</td>
                    <input type="checkbox"/>
                    <button onClick={() => this.deleteCyclist(request.id)} type="button" className="btn-delete btn-float btn">Delete</button>
                    <button type="button" className="btn-edit btn-float btn btn">Edit</button>
                    <button type="button" className="btn-approve btn-float btn btn-success">Approve</button>
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