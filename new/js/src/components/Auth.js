import React, { Component } from 'react';
import { connect } from 'react-redux'
import _ from 'lodash'
import { API_ROUTES, BASE_API_URL, SERVICE_ACCOUNT_KEYS } from '../constants'
import { requestUser } from '../datastore/auth/authAction'

const styles = {
  error: 'tomato'
}

class Auth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authFile: null,
      errorMsg: '',
      hasError: true
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

    if (newState.authFile) {
      const isOfInvalidType = ![
        'text/javascript',
        'application/x-javascript',
        'application/json'
      ].some(type => type === newState.authFile.type)

      if (isOfInvalidType) {
        newState.hasError = true
        newState.errorMsg = 'Wrong file type!'
        this.setState(newState)
        return null
      } else {
        newState.hasError = false
      }

      const readFile = new FileReader()
      readFile.onloadend = event => {
        const contents = event.target.result
        const json = JSON.parse(contents)
        if (JSON.stringify(Object.keys(json)) === JSON.stringify(SERVICE_ACCOUNT_KEYS)) {
          newState.hasError = false
        } else {
          newState.hasError = true
          newState.errorMsg = `Incorrect service account file uploaded. It misses one or some keys from the following list: ${SERVICE_ACCOUNT_KEYS}`
        }
        this.setState(newState)
      }
      readFile.readAsText(newState.authFile)
    } else {
      newState.hasError = true
      newState.errorMsg = 'No input file'
      this.setState(newState)
    }
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
        this.setState(Object.assign({}, this.state))
        this.props.dispatch(requestUser())
      }
    })

  }

  render() {
    const { hasError, errorMsg } = this.state
    return(
      <div className='card-panel'>
        <form action='#'>
          <h2>Log in with your Google service account(.json file)</h2>
          <div className='file-field input-field'>
            <div className='btn'>
              <span><i className="material-icons left">file_upload</i>File</span>
              <input type='file' onChange={this._onChange} />
            </div>
            <div className='file-path-wrapper'>
              <input type='text'
                className='file-path validate'
                placeholder='Log in with your Google service account(.json file)'
              />
            </div>
          </div>
          { hasError &&
            <div style={{ color: styles.error, padding: '0 0.75rem' }}
              className='helper-text'>{errorMsg}</div>
          }
          <button type="submit" name="action"
            className="btn waves-effect waves-light right"
            disabled={hasError}
            onClick={this._onSubmit}>Log in
            <i className="material-icons right">arrow_forward</i>
          </button>
          <div className='clearfix'></div>
        </form>
      </div>
    )
  }
}

export default connect()(Auth)