import React, { Component } from 'react'

class Requests extends Component {
    componentWillMount() {
        console.log("Request")
        console.log(this.props)
    }

    render() {
        return (
            <div className="jumbotron container">
            <div className="row">
            <div className="col-sm-8">
            <h1 className="display-3">Requests</h1>
                </div>
             </div>
            </div>
        )
    }
}

export default Requests