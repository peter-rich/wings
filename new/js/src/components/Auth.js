import React, { Component } from 'react';
import { connect } from 'react-redux'
import _ from 'lodash'
import { API_ROUTES, BASE_API_URL } from '../constants'
import { requestUser } from '../datastore/auth/authAction'

class Auth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authFile: null,
      authBtnDisabled: true,
      isLoggedIn: false
    }
  }

  componentDidMount() {
    fetch(`${BASE_API_URL}${API_ROUTES.LOG_IN}`, {
      mode: 'no-cors',
      method: 'GET',
    })
    .then(res => res.json())
    .then(json => {
      if (json.success) {
        this.setState(Object.assign({}, this.state, { isLoggedIn: true }))
      }
    })
    .catch(err => {
      console.error(err)
    })
  }

  _onChange = event => {
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
    fetch(`${BASE_API_URL}${API_ROUTES.LOG_IN}`, {
      mode: 'no-cors',
      method: 'POST',
      body: formDate,
    })
    .then(res => res.json())
    .then(json => {
      if (json.success) {
        this.setState(Object.assign({}, this.state, { isLoggedIn: true }))
        this.props.dispatch(requestUser())
      }
    })

  }

  render() {
    const { authBtnDisabled, isLoggedIn } = this.state
    return(
      <div className='card-panel'>
        <form action='#'>
          <div className='file-field input-field'>
            <div className='btn'>
              <span>File</span>
              <input type='file' onChange={this._onChange} />
            </div>
            <div className='file-path-wrapper'>
              <input type='text'
                className='file-path validate'
                placeholder='Upload authentication file(JSON)'
              />
            </div>
          </div>
          <button type="submit" name="action"
            className="btn waves-effect waves-light right"
            disabled={authBtnDisabled}
            onClick={this._onSubmit}>Authenticate
            <i className="material-icons right">arrow_forward</i>
          </button>
          <div className='clearfix'></div>
        </form>
        <h2 style={{ color: isLoggedIn ? 'lightGreen' : 'red' }}>
          You are { isLoggedIn ? 'Logged in' : 'not logged in' }
        </h2>
      </div>
    )
  }
}

export default connect()(Auth)