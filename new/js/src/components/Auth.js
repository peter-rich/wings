import React, { Component } from 'react';
import _ from 'lodash'

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
    console.log(JSON.parse(this.state.authFile))
  }

  _onSubmit = (e) => {
    e.preventDefault()
    const data = new FormData()
    console.log(this.state.authFile)
    data.append('file', this.state.authFile)
    console.log(data)
    fetch('http://localhost:8081/api/auth', {
      mode: 'no-cors',
      method: 'POST',
      body: {adad:123123, asdaksdjnaier: 123120},
      headers: {
        authorization: 'SECRET_TOKEN',
        // 'Content-Type': 'multipart/form-data'
      }
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