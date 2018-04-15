import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Modal } from "react-bootstrap"
import './requests.css'
import api from './api'
import Moment from 'moment'
import CyclistModal from './cyclistModal'
import eventsApi from '../events/api'

class Requests extends Component {
    constructor(props){
        super(props)
        this.state = {
          requests: null,
          counter: 0,
          editBtn: false,
          deleteBtn: false,
          approveBtn: false,
          bk: false,
          edit: false,
          cyclist: null,
          lastEventId: null,
        }

        this.counter = this.counter.bind(this)
        this.deleteCyclist = this.deleteCyclist.bind(this)
        this.approve = this.approve.bind(this)
        this.editClick = this.editClick.bind(this)
        this.onSaveButtonClick = this.onSaveButtonClick.bind(this)
        this.onCloseButtonClick = this.onCloseButtonClick.bind(this)
        this.renewCyclistsState = this.renewCyclistsState.bind(this)
      }

   componentWillMount() {
    this.renewCyclistsState()
    eventsApi.getEvents(this.props.user).then(omniums => {
        if (omniums.length != 0) {
            this.setState({
                lastEventId: omniums[omniums.length-1].id
            })
        }
    })
   }

   onSaveButtonClick(){
    this.renewCyclistsState()
    }

  onCloseButtonClick(){
    this.setState({
        edit: false
    })
  }

  renewCyclistsState(){
    api.getRequests(this.props.user).then( requests => {
        this.setState({ requests,  edit: false, })
        this.counter()
    })
  }

   counter(){
    const countTypes = []
       if (this.state.requests) {
        this.state.requests.map(function(req, i) {
            countTypes.push(req)
        })
       }
       this.props.badgeSet(countTypes.length)
    }

   deleteCyclist(id) {
       api.deleteCyclist(this.props.user, id).then(() => {
           console.log('User was deleted')
           this.renewCyclistsState()
       })
   }

   approve(id){
       console.log('Approving cyclist')
       api.approveCyclist(this.props.user, id, this.state.lastEventId).then(() => {
           console.log('approved')
           this.renewCyclistsState()
       })
   }

   editClick(cyclist){
       this.setState({ edit: true, cyclist })
   }

    render() {
        const { requests, deleteBtn, edit } = this.state
        return (
            <div className="container">
            <div className="row">
            <div className="listPosition col-sm-8">
            <div className="border-bottom" >
                <h1 className="display-3">Requests</h1>
            </div>
            <table className="fit table table-striped">
            <thead className="left">
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
      { requests && requests.map((request, index) => {
              return (
                <tbody key={request.id} className="left">
                    <td>{request.firstName}</td>
                    <td>{request.lastName}</td>
                    <td> {request.uciCode}</td>
                    <td> {request.team}</td>
                    <td> {request.nationality}</td>
                    <td>{Moment(request.date).format('YYYY-MM-YY')}</td>
                    <td> {request.category}</td>
                    <button onClick={() => this.deleteCyclist(request.id)} type="button" className="btn-delete btn-float btn">Delete</button>
                    <button key={request.id} type="button" onClick={() => this.editClick(request)} className="btn-edit btn-float btn btn">Edit</button>
                    <button type="button" onClick={() => this.approve(request.id)} className="btn-approve btn-float btn btn-success">Approve</button>
                    { edit && (
                       <Modal.Dialog>
                            <Modal.Header>
                                <Modal.Title>Edit cyclist info</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <CyclistModal cyclist={this.state.cyclist} user={this.props.user} auth={this.props.auth} onCloseButtonClick={this.onCloseButtonClick} action={this.onSaveButtonClick}/>
                            </Modal.Body>
                            <Modal.Footer>
                            </Modal.Footer>
                      </Modal.Dialog>
                ) }
                 </tbody>
              )
            })
          }
    </table>
            </div>
            </div>
            </div>
        )
    }
}

export default Requests