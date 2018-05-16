
import React, { Component } from 'react'
// import { Navbar, Button } from 'react-bootstrap'
import './registration.css'
import axios, { post } from 'axios'
import structure from '../../images/REGISTRATION/registration.png'
import sheetName from '../../images/REGISTRATION/sheetName.png'

class Registration extends Component {
  constructor(props){
    super(props)
    this.state = {
      file: null,
      success: false,
      failed: false,
      user: null,
      authenticated: null
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }

  componentWillMount() {
   this.setState({user: this.props.user, authenticated: this.props.authenticated})
  }

  onFormSubmit(e){
    e.preventDefault() // Stop form submit
    this.fileUpload(this.state.file).then((response) =>{
      if (response.data == 'File was uploaded') {
        this.setState({ success: true, failed: false })
        this.props.badgeSet(this.props.user)
      } else {
        this.setState({ failed: true, success: false})
      }
    })
  }
  onChange(e) {
    this.setState({file:e.target.files[0]})
  }

  fileUpload(file){
    if (this.props.user) {
      const url = 'http://localhost:8080/api/uploadFile'
      const formData = new FormData();
      formData.append('file',file)
      const config = {
          headers: {
              'content-type': 'multipart/form-data'
          }
      }
      return  post(url, formData , config)
    }
  }

  render() {
    const { success, failed , authenticated, user} = this.state
    return (
      <div className="txt container">
      <article>
        <div className="border-bottom">
          <h1>Register cyclists</h1>
        </div>
        <div className="from-top">
        <p>
          <h4>Here you can upload .xlsx (excel) file with all your riders information.</h4>
        </p>
        <p>
          <h4>
          <strong>
          Please follow steps bellow.
          </strong>
         </h4>
            <ol>
              <li className="list-items">Create excel file with same column names. Fill in with your cyclists data</li>
              <img src={structure} alt="data structure" height="400" width="1000"/>
              <li className="list-items">Once you fill in your team data make sure you changed sheet name to<strong> registration </strong></li>
              <img src={sheetName} alt="data structure" height="200" width="500"/>
              <li className="list-items">Choose your file and click "Upload" button. If file was successfully uploaded you will see the message</li>
            </ol>
        </p>
        </div>
      </article>
      {
        authenticated ? (
          <form onSubmit={this.onFormSubmit}>
          <input className="cho-file" type="file" onChange={this.onChange} />
          <button className="upl-btn btn" type="submit">Upload</button>
        </form>
        ) : (
          <div>
            <h3>You need to log in to be able to upload file</h3>
          </div>
        )
      }
      { success && (
        <div className="success alert alert-success" role="alert">
        <strong> File was uploaded. Two days before race check riders list.</strong>
        </div>
      ) }
      {
        failed && (
        <div className="alert alert-danger" role="alert">
        <strong> Something went wrong. </strong>
          Make sure you followed all steps and try again
        </div>
        )
      }
      </div>
    )
  }
}

export default Registration

