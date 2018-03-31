import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Modal } from "react-bootstrap"
import './requests.css'
import api from './api'
import Moment from 'moment'
import CyclistModal from './cyclistModal'

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
        }

        this.counter = this.counter.bind(this)
        this.deleteCyclist = this.deleteCyclist.bind(this)
        this.approve = this.approve.bind(this)
        this.editClick = this.editClick.bind(this)
        this.onSaveButtonClick = this.onSaveButtonClick.bind(this)
        this.onCloseButtonClick = this.onCloseButtonClick.bind(this)
      }

   componentWillMount() {
    api.getRequests(this.props.user).then( requests => {
        this.setState({ requests })
        this.counter()
    })
   }

   onSaveButtonClick(){
        this.setState({
            edit: false,
        })
        window.location.reload()
    }

  onCloseButtonClick(){
    this.setState({
        edit: false
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
       console.log(id)
       api.deleteCyclist(this.props.user, id).then(() => {
           console.log('User was deleted')
           window.location.reload()
       })
   }

   approve(id){
       console.log('Approving cyclist')
       api.approveCyclist(this.props.user, id).then(() => {
           console.log('approved')
           window.location.reload()
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