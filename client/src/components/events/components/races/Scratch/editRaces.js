
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './scratch.css'
import raceApi from './api'
import ScratchItemEdit from './components/scratchItem/scratchItemEdit'
import helper from '../helper'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const getItems = count =>
Array.from({ length: count }, (v, k) => k).map(k => ({
  id: `item-${k}`,
  content: `item ${k}`,
}));

// a little function to help us with reordering the result

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  // padding: grid,
  // width: 1000,
});
const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  // padding: grid * 2,
  // margin: `0 0 ${grid}px 0`,
  // width: 1000,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class ScratchEdit extends Component {
  constructor(props){
    super(props)
    this.state = {
      menScores: null,
      raceId: null,
      eventName: null,
      cyclists: null,
      raceOrder: 1,
      category: null,
      womenScores: null,
      menScoresStartList: null,
      womenStartList: null,
    }
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const menScores = reorder(
      this.state.menScores,
      result.source.index,
      result.destination.index
    );

    this.setState({
      menScores,
    });
  }

  componentWillMount() {
    console.log('ScratchInsideEDIt')
    localStorage.setItem('activeTab', 11)
    this.setState({ eventName: localStorage.getItem('eventName')})
    this.setState({
      category: localStorage.getItem('category')
    })
    console.log(this.props.location.pathname)
    const path = `/events/${this.props.omniumId}/races/1`
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      path,
      localStorage.getItem('category'),
     ).then( scores => {
      const startList = helper.scratchRaceStartList(scores)
      this.setState({ menScores: scores, menScoresStartList: startList})
    })
    raceApi.getScoresOfSpecificRace(
      this.props.user,
      path,
      'women'
     ).then( scores => {
      const startList = helper.scratchRaceStartList(scores)
      this.setState({ womenScores: scores, womenStartList: startList })
    })
  }

  render() {
    const { omniumId, activeTab, isStartList } = this.props
    const { races,
      scores,
      cyclists,
      menScores,
      womenScores,
      menScoresStartList,
      womenStartList  } = this.state
    console.log(Number(localStorage.getItem('activeTab')))
    const category = localStorage.getItem('category')
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
      <div className="space-from-top">
       { localStorage.getItem('activeTab') === '11' && (
        <table className="table table-striped">
        <thead>
        {
          isStartList ? (
            <tr >
            <th scope="col">Order</th>
            <th scope="col">No</th>
            <th scope="col">Name</th>
            <th scope="col">UCI code</th>
            <th scope="col">Nationality</th>
            </tr>
          ) : (
            <tr>
            {
                ( Number(localStorage.getItem('activeTab')) === 11 ||
                  Number(localStorage.getItem('activeTab')) === 22 ||
                  Number(localStorage.getItem('activeTab')) === 33 ||
                  Number(localStorage.getItem('activeTab')) === 44) ? (
                  <th scope="col"></th>
                ): (
                  <th scope="col">Rank</th>
                )
            }
            <th scope="col">No</th>
            <th scope="col">Name</th>
            <th scope="col">UCI code</th>
            <th scope="col">Nationality</th>
            <th scope="col">+20</th>
            <th scope="col">-20</th>
            <th scope="col">Finish place</th>
            <th scope="col">Total points</th>
            <th scope="col">DNS</th>
            <th scope="col">DNQ</th>
            <th scope="col">DNF</th>
            </tr>
          )
        }
      </thead>
      <Droppable className="dnd" droppableId="droppable">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
      {/* <tbody> */}


      { category === 'men' ? (
        isStartList ? (
          menScoresStartList &&  menScoresStartList.map((score, id) => (
        <Draggable key={score.id} draggableId={score.id} index={id}>
                  {(provided, snapshot) => (
                    <tbody
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
            <ScratchItemEdit
              key={`${score.id}${Math.random()}`}
              score={score}
              eventId={this.props.omniumId}
              user={this.props.user}
              rankId={id}
              provided={provided}
              snapshot={snapshot}
              isDragging={this.isDragging}
              isDraggingOver={this.isDraggingOver}
              onDragEnd={this.onDragEnd}
              isStartList={this.props.isStartList}
              category={this.state.category}
            />
            </tbody>
                  )}
        </Draggable>
          ))
        ) : (
          menScores &&  menScores.map((score, id) => (
            <Draggable key={score.id} draggableId={score.id} index={id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(
                  snapshot.isDragging,
                  provided.draggableProps.style
                )}
              >
            <ScratchItemEdit
              key={`${score.id}${Math.random()}`}
              score={score}
              eventId={this.props.omniumId}
              user={this.props.user}
              rankId={id}
              isStartList={this.props.isStartList}
              category={this.state.category}
            />
             </div>
                  )}
        </Draggable>
          ))
        )
      ) : (
        isStartList ? (
          womenStartList && womenStartList.map((score, id) => (
            <ScratchItemEdit
              key={`${score.id}${Math.random()}`}
              score={score}
              eventId={this.props.omniumId}
              user={this.props.user}
              rankId={id}
              isStartList={this.props.isStartList}
              category={this.state.category}
            />
          ))
        ) : (
          womenScores && womenScores.map((score, id) => (
            <ScratchItemEdit
              key={`${score.id}${Math.random()}`}
              score={score}
              eventId={this.props.omniumId}
              user={this.props.user}
              rankId={id}
              isStartList={this.props.isStartList}
              category={this.state.category}
            />
          ))
        )
      )
    }
        {/* //   return (
        //     <tr key={id} className="left">
        //     <th key={id} scope="row">{score.finishPlace}</th>
        //     <td className="number">{score.raceNumber}</td>
        //     <td>{score.Cyclist.firstName} {score.Cyclist.lastName}</td>
        //     <td>{score.Cyclist.nationality}</td>
        //     <td>{score.points}</td>
        //     <td>{score.totalPoints}</td>
        //     </tr>
        //   )
        // })} */}

        {/* </tbody> */}
        {provided.placeholder}
        </div>
      )}
      </Droppable>
        </table>
      )}
      </div>
    </DragDropContext>
    )
  }
}

export default ScratchEdit

