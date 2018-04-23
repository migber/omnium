import React, { Component } from 'react'
import api from '../api'
import '../elimination.css'
import scratchItemApi from '../../Scratch/components/scratchItem/api'

class EliminationItemEdit extends Component {
  constructor(props){
    super(props)
    this.state = {
      rankId: props.rankId,
      raceOrder: 3,
      raceNumber: props.score.raceNumber,
      eventId: props.eventId,
      scoreId: props.score.id,
      bk: props.score.bk,
      dns: props.score.dns,
      dnf: props.score.dnf,
      dnq: props.score.dnq,
      positionBefore: props.score.positionBefore,
      points: props.score.points,
      finishPlace: props.score.finishPlace,
      place: props.score.place,
      firstName: props.score.Cyclist.firstName,
      lastName: props.score.Cyclist.lastName,
      uciCode: props.score.Cyclist.uciCode,
      nationality: props.score.Cyclist.nationality,
      eliminated: null,
    }
    this.handleChangeDNF = this.handleChangeDNF.bind(this)
    this.handleChangeDNQ = this.handleChangeDNQ.bind(this)
    this.handleChangeDNS = this.handleChangeDNS.bind(this)
    this.eliminateCyclistChild = this.eliminateCyclistChild.bind(this)
  }

  componentWillMount() {
    const eliminated = this.state.points !== 0 ? true : false
    this.setState({
      eliminated
    })
  }

  handleChangeDNF(score){
    this.setState({
      dnf: score.dnf
    })
  }

  handleChangeDNS(score){
    this.setState({
      dns: score.dns
    })
  }

  handleChangeDNQ(score){
    this.setState({
      dnq: this.state.dnq
    })
  }

  eliminateCyclistChild(scoreId){
    const eliminated = this.state.points !== 0 ? true : false
    this.setState({
      eliminated
    })
    this.props.eliminateCyclist(scoreId)
  }

  render() {
    const {
      rankId,
      raceNumber,
      scoreId,
      bk,
      dns,
      dnf,
      dnq,
      points,
      finishPlace,
      place,
      firstName,
      lastName,
      uciCode,
      nationality,
      eliminated,
    } = this.state
    const { isStartList } = this.props
    return (
    <div>
      <a role="button" className={eliminated ? "elmn list-group-item list-group-item-action list-group-item-primary" : "list-group-item list-group-item-action list-group-item-primary"}
        onClick={() => this.eliminateCyclistChild(scoreId)}
      >
        {
          !isStartList && dns ? (
            "DNS"
          ) : dnf ? (
            "DNF"
          ) : dnq ? (
            "DNQ"
          ) : bk ? (
            "BK"
          ) : (
            ""
          )
        }
        <strong> {raceNumber} </strong> {lastName}   {firstName} {uciCode}  {nationality}
    </a>
    <div>
          <label key={`${scoreId}${Math.random()}`} className="lbl-text"> DNS
          <br></br>
          <input key={`${scoreId}${Math.random()}`}
                 type="checkbox"
                 className="mrg-inp"
                 checked={dns}
                 onChange={() => this.props.handleChangeDNS(this.state.raceOrder, this.state.scoreId)}
          />
          </label>
          <label key={`${scoreId}${Math.random()}`} className="lbl-text"> DNQ
          <br></br>
          <input key={`${scoreId}${Math.random()}`}
                 type="checkbox"
                 className="mrg-inp"
                 checked={dnq}
                 onChange={() => this.props.handleChangeDNQ(this.state.raceOrder, this.state.scoreId)}
          />
          </label>
          <label key={`${scoreId}${Math.random()}`} className="lbl-text"> DNF
          <br></br>
          <input key={`${scoreId}${Math.random()}`}
                 type="checkbox"
                 className="mrg-inp"
                 checked={dnf}
                 onChange={() => this.props.handleChangeDNF(this.state.raceOrder, this.state.scoreId)}
          />
          </label>
        </div>
    </div>
    )
  }
}

export default EliminationItemEdit