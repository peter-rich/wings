import React, { Component } from 'react';
import _ from 'lodash'
import { API_ROUTES, BASE_API_URL } from '../constants'
class Auth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authFile: null,
      authBtnDisabled: true
    }
  }

  _onChange = event => {
    console.log(event.target.files[0])
    let newState = _.cloneDeep(this.state)
    newState.authFile = event.target.files[0]
    if (event.target.files[0])
      newState.authBtnDisabled = false
    else
      newState.authBtnDisabled = true
    this.setState(newState)
  }

  _onSubmit = (e) => {
    e.preventDefault()
    const formDate = new FormData()
    formDate.append('authFile', this.state.authFile)
    for(var pair of formDate.entries()) {
      console.log(pair[0]+ ', '+ pair[1])
    }
    fetch(`${BASE_API_URL}${API_ROUTES.LOG_IN}`, {
      mode: 'no-cors',
      method: 'POST',
      body: formDate,
      // headers: {
      //   authorization: 'SECRET_TOKEN',
      //   'Content-Type': 'multipart/form-data'
      // }
    })
    .then(res => {
      console.log(res.statusText)
    })

  }

  render() {
    const { authBtnDisabled } = this.state
    return(
      <div>
        <label htmlFor="avatar">Upload authentication file(JSON)</label>
        <input type="file"
          id="auth-file"
          name="auth-file"
          accept=".json"
          onChange={this._onChange}></input>
        <button onClick={this._onSubmit} disabled={authBtnDisabled}>Authenticate</button>
      </div>
    )
  }
}

export default Auth