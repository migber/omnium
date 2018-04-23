import React, { Component } from 'react'
import api from '../api'
import scratchItemApi from '../../../Scratch/components/scratchItem/api'

const PLACE_TO_POINTS = {
  1:5,
  2:3,
  3:2,
  4:1,
}
const FINAL_FINISH = {
  1:10,
  2:6,
  3:4,
  4:2,
}

class PointRaceItemSprints extends Component {
  constructor(props){
    super(props)
    this.state = {
      rankId: props.rankId,
      raceOrder: 0,
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
      sprintPoints: 0,
      sprintOrder: 1,
      sprints: props.score.Sprints,
      eliminated: null,
    }
    this.handleChangeDNF = this.handleChangeDNF.bind(this)
    this.handleChangeDNQ = this.handleChangeDNQ.bind(this)
    this.handleChangeDNS = this.handleChangeDNS.bind(this)
    this.saveSprint = this.saveSprint.bind(this)
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

  saveSprint(sprintNr, scoreId){
    const order = this.props.sprintOrder
    let points
    switch (localStorage.getItem('category')) {
      case 'men':
        points = sprintNr === 10 ? FINAL_FINISH[order] : PLACE_TO_POINTS[order]
        break;
      case 'women':
      case 'juniorsM':
        points = sprintNr === 8 ? FINAL_FINISH[order] : PLACE_TO_POINTS[order]
        break;
      case 'juniorsW':
        points = sprintNr === 6 ? FINAL_FINISH[order] : PLACE_TO_POINTS[order]
        break
      default:
        break;
    }
    const sprint = {
      sprintNumber: this.props.activeSprint,
      sprintPoints: points,
    }
    const { sprints } = this.state
    let sprintId
    sprints.forEach((sprint) => {
      if (sprint.sprintNumber === this.props.activeSprint) {
          sprintId =  sprint.id
      }
    })
    api.updateSprint(
      this.props.user,
      this.props.eventId,
      this.state.raceOrder,
      scoreId,
      sprint,
      sprintId,
    ).then((sprint) => {
    })
    this.setState({
      eliminated: !this.state.eliminated,
      sprintPoints: points,
    })
    this.props.recalculateSprintsCounter()
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
      sprintPoints,
    } = this.state
    const { isStartList } = this.props
    return (
      <a role="button" className={eliminated ? "elmn list-group-item list-group-item-action list-group-item-primary" : "list-group-item list-group-item-action list-group-item-primary"}
        onClick={() => this.saveSprint(this.props.activeSprint, scoreId)}
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
        <strong> {raceNumber} </strong> {lastName}   {firstName} {uciCode}  {nationality} <strong> {sprintPoints} {sprintPoints === 1 ? "point" : "points"} </strong>
     </a>
    )
  }
}

export default PointRaceItemSprints