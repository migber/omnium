
import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import './scratch.css'
import raceApi from './api'
import ScratchItemEdit from './components/scratchItem/scratchItemEdit'
import helper from '../helper'
import scratchItemApi from './components/scratchItem/api'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const getItems = count =>
Array.from({ length: count }, (v, k) => k).map(k => ({
  id: `item-${k}`,
  content: `item ${k}`,
}))

// a little function to help us with reordering the result
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
})

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

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
      scores: null,
      raceId: null,
      eventName: null,
      cyclists: null,
      raceOrder: 1,
      category: null,
      scoresList: null,
    }
    this.onDragEnd = this.onDragEnd.bind(this)
    this.changeList = this.changeList.bind(this)
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
    scratchItemApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      localStorage.getItem('category'),
     ).then( scores => {
      const startList = helper.scratchRaceStartList(scores)
      this.setState({ scores, scoresList: startList})
    })
  }

  changeList(category){
    console.log("inside")
    scratchItemApi.getScoresOfSpecificRace(
      this.props.user,
      this.props.omniumId,
      this.state.raceOrder,
      category,
     ).then((scores) => {
       console.log(scores)
        const startList = raceHelper.scratchRaceStartList(scores)
        const orderedScores = raceHelper.orderByPlace(scores)
        this.setState({
           scores: orderedScores,
           scoresList: startList,
        })
    })
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  componentWillUnmount() {
    this.props.onRef(null)
  }

  render() {
    const { omniumId, activeTab, isStartList } = this.props
    const { races,
      scores,
      cyclists,
      menScores,
      scoresList,
    } = this.state
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
      {
        isStartList ? (
          scoresList &&  scoresList.map((score, id) => (
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
          scores &&  scores.map((score, id) => (
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
    }
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

