import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Modal } from "react-bootstrap"
import api from './api'
import Moment from 'moment'

class UserRequests extends Component {
    constructor(props){
        super(props)
        this.state = {
          requests: null,
          deleteBtn: false,
          approveBtn: false,
        }

        this.deleteUser = this.deleteUser.bind(this)
        this.getRequests = this.getRequests.bind(this)
        this.approve = this.approve.bind(this)
      }

   componentWillMount() {
    this.getRequests()

   }

   deleteUser(id) {
       api.deleteUser(this.props.user, id).then(() => {
        this.props.newUserRequests(this.props.user)
        this.getRequests()
       })
   }

   approve(id){
       api.approveUser(this.props.user, id).then(() => {
         this.props.newUserRequests(this.props.user)
         this.getRequests()
       })
   }

   getRequests() {
     console.log(this.props.user)
      api.getUserRequests(this.props.user).then((requests) => {
        this.setState({
          requests
        })
      })
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
                <th scope="col">Phone</th>
                <th scope="col">Email address</th>
            </tr>
            </thead>
      { requests && requests.map((request, index) => {
              return (
                <tbody key={request.id} className="left">
                    <td>{request.name}</td>
                    <td>{request.surname}</td>
                    <td> {request.phone}</td>
                    <td> {request.email}</td>
                    <button onClick={() => this.deleteUser(request.id)} type="button" className="btn-delete btn-float btn">Delete</button>
                    <button type="button" onClick={() => this.approve(request.id)} className="btn-approve btn-float btn btn-success">Approve</button>
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

export default UserRequests