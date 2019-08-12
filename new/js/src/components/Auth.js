import React, { Component } from 'react';
import _ from 'lodash'
import axios from 'axios'

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
    this.authFile = event.target.files[0]
  }

  _onSubmit = () => {
    const data = new FormData()
    data.append('file', this.state.authFile)
    axios.post("http://localhost:8081/api/auth", data, {
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
        <button disabled={authBtnDisabled}>Authenticate</button>
      </div>
    )
  }
}

export default Auth