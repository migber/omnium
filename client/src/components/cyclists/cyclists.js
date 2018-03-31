
import React, { Component } from 'react'
import CyclistModal from './cyclistModalScore'
import { Modal } from "react-bootstrap"
import { VIP_EMAIL } from '../../config/env'
import { Switch, Route } from 'react-router-dom'

import './cyclists.css'
import api from './api'

class Cyclists extends Component {
  constructor(props){
    super(props)
    this.state = {
      cyclistsWomen: null,
      cyclistsMen: null,
      btnActive: 'men',
      activeList: null,
      edit: false,
      cyclist: null,
    }

    this.changeList = this.changeList.bind(this)
    this.deleteCyclist = this.deleteCyclist.bind(this)
    this.onSaveButtonClick = this.onSaveButtonClick.bind(this)
    this.onCloseButtonClick = this.onCloseButtonClick.bind(this)
    this.editClick = this.editClick.bind(this)
  }

  componentWillMount() {
    api.getScoresWomen(this.props.user, 1).then( scores => {
      this.setState({ cyclistsWomen: scores })
    })
    api.getScoresMen(this.props.user, 1).then( scores => {
      this.setState({ cyclistsMen: scores, activeList: scores })
    })
   }

   changeList(cat){
     this.setState( { btnActive: cat })
     if (cat !== 'men') {
      this.setState( { activeList: this.state.cyclistsWomen })
     } else {
      this.setState( { activeList: this.state.cyclistsMen })
     }
   }

   deleteCyclist(id) {
    api.deleteCyclist(this.props.user, id).then(() => {
        console.log('User was deleted')
        window.location.reload()
    })
  }

  onSaveButtonClick(category){
    this.setState({
        edit: false,
        btnActive: category,
    })
    window.location.reload()
  }

  onCloseButtonClick(){
    this.setState({
      edit: false
    })
  }

  editClick(cyclist){
    this.setState({ edit: true, cyclist })
  }


  render() {
    const { activeList, btnActive, edit } = this.state
    const { user } = this.props
    return (
      <div className="container">
      <div className="row">
      <div className="listPosition col-sm-8">
      <h1 className="display-3">Cyclists</h1>
      <div className="smal-div left-marging space-from-top btn-group" role="group" aria-label="...">
          <button id="men" type="button" className={(btnActive === 'men') ? "choice-btn-active btn btn-default" : "choice-btn btn btn-default"} onClick={() => this.changeList('men')} name="men">Men</button>
          <button id="women" type="button" className={(btnActive === 'women') ? "choice-btn-active btn btn-default" : "choice-btn btn btn-default"} onClick={() => this.changeList('women')} name="women">Women</button>
      </div>
      <table className="fit table">
      <thead className="text">
          <tr className="">
          <th>Race No</th>
          <th>First name</th>
          <th>Last name</th>
          <th>UCI Code</th>
          <th>Team</th>
          <th>Nationality</th>
          <th>Category</th>
          <th>b/k</th>
      </tr>
      </thead>
      { activeList && activeList.map((request, index) => {
        return (
          <tbody className="text" key={request.id}>
           <tr>
             <td className="raceNo">{request.raceNumber}</td>
              <td>{request.Cyclist.firstName}</td>
              <td>{request.Cyclist.lastName}</td>
              <td> {request.Cyclist.uciCode}</td>
              <td> {request.Cyclist.team}</td>
              <td> {request.Cyclist.nationality}</td>
              <td> {request.Cyclist.category}</td>
              <span className={ request.bk === false ? " " : "glyphicon glyphicon-ok"} aria-hidden="true"></span>
              <button onClick={() => this.deleteCyclist(request.id)} type="button" className="btn-delete btn-float btn">Delete</button>
              <button key={request.id} type="button" onClick={() => this.editClick(request)} className="btn-edit btn-float btn btn">Edit</button>
          </tr>
           </tbody>
        )
      })
    }
</table>
      </div>
      </div>
      {/* { user.email == VIP_EMAIL && ( */}
      { edit && (
         <Modal.Dialog>
         <Modal.Header>
             <Modal.Title>Edit cyclist info</Modal.Title>
         </Modal.Header>
         <Modal.Body>
              <CyclistModal
              cyclist={this.state.cyclist}
              user={this.props.user} auth={this.props.auth}
              onCloseButtonClick={this.onCloseButtonClick}
              action={this.onSaveButtonClick}
              eventId={1}/>
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
    </Modal.Dialog>
      )}
      </div>
    )
  }
}

export default Cyclists

