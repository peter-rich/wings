import React, { Component } from 'react'
import PropTypes from 'prop-types'
import fieldShape from './fieldShape'
import _ from 'lodash'
import { BASE_API_URL } from '../../constants'
import MC from "materialize-css";
class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: {
        time_zone: {
          required: true,
          value: null
        },
        log_file: {
          required: true,
          value: null
        },
        sample_name: {
          required: true,
          value: null
        },
        read_group: {
          required: true,
          value: null
        },
        platform: {
          required: true,
          value: null
        },
        input_file_1: {
          required: true,
          value: null
        },
        input_file_2: {
          required: true,
          value: null
        },
        output_file: {
          required: true,
          value: null
        },
      }
    }
    this._onChange = this._onChange.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }

  _onChange = (e) => {
    let newState = _.cloneDeep(this.state)
    newState.formData[e.target.name].value = e.target.value
    console.log(newState.formData)
    this.setState(newState)
  }

  _onSubmit = (e) => {
    e.preventDefault()
    console.table(this.state.formData)
    const formData = {}
    Object.keys(this.state.formData).forEach(key => {
      formData[key] = this.state.formData[key].value
    })
    const { API_ROUTE } = this.props
    fetch(`${BASE_API_URL}/${API_ROUTE}`, {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(json => console.log(json))
  }

  componentDidMount() {
    MC.AutoInit()
  }

  render() {
    const { title, fields } = this.props
    return (
      <div className="row">
        <form onSubmit={this._onSubmit}
          className="col s12 m10 push-m1 l8 push-l2">
          <h3 className="header">{title}</h3>
          { fields.map((field,i) =>{
            if (field.key === 'time_zone') {
              return (
                <div key={`form-field-${i}`} className="row">
                  <div className="input-field col s12">
                    <label htmlFor={field.key}>{field.title}</label>
                    <select name={field.key}
                      className="browser-defa______ult"
                      defaultValue='__placeholder'
                      onChange={this._onChange}>
                      <option value="__placeholder" disabled>⬇️--- Please select a time zone ---️️️ ⬇️</option>
                      <option value="us-central1-a">us-central1-a</option>
                      <option value="us-central1-b">us-central1-b</option>
                      <option value="us-central1-c">us-central1-c</option>
                      <option value="us-central1-f">us-central1-f</option>
                      <option value="us-east1-b">us-east1-b</option>
                      <option value="us-east1-c">us-east1-c</option>
                      <option value="us-east1-d">us-east1-d</option>
                      <option value="us-east4-a">us-east4-a</option>
                      <option value="us-east4-b">us-east4-b</option>
                      <option value="us-east4-c">us-east4-c</option>
                      <option value="us-west1-a">us-west1-a</option>
                      <option value="us-west1-b">us-west1-b</option>
                      <option value="us-west1-c">us-west1-c</option>
                      <option value="us-west2-a">us-west2-a</option>
                      <option value="us-west2-b">us-west2-b</option>
                    </select>
                  </div>
                </div>
              )
            } else {
              return (
                <div key={`form-field-${i}`} className="row">
                  <div className="input-field col s12">
                    <label htmlFor={field.key}>{field.title}</label>
                    <input name={field.key}
                      type="text"
                      className="validate"
                      onChange={this._onChange} />
                  </div>
                </div>
              )
            }
          })
          }
          <div className="row">
            <div className="input-field col s12">
              <button type="submit" name="action"
                className="btn waves-effect waves-light"
                onClick={this._onSubmit}>Submit Job
                <i className="material-icons right">send</i>
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

Form.propTypes = {
  title: PropTypes.string.isRequired,
  API_ROUTE: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.shape(fieldShape))),
}

export default Form
