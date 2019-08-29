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
        region: {
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
        bucket_name: {
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
    fetch(`${BASE_API_URL}${API_ROUTE}`, {
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
            if (field.key === 'region') {
              return (
                <div key={`form-field-${i}`} className="row">
                  <div className="input-field col s12">
                    <label htmlFor={field.key}>{field.title}</label>
                    <select name={field.key}
                      className="browser-defa______ult"
                      defaultValue='__placeholder'
                      onChange={this._onChange}>
                      <option value="__placeholder" disabled>⬇️--- Please select a region ---️️️ ⬇️</option>
                      {/* <option value='asia-east1'>asia-east1 (Taiwan)</option>
                      <option value='asia-east2'>asia-east2 (Hong Kong)</option>
                      <option value='asia-northeast1'>asia-northeast1 (Tokyo)</option>
                      <option value='asia-northeast2'>asia-northeast2 (Osaka)</option>
                      <option value='asia-south1'>asia-south1 (Mumbai)</option>
                      <option value='asia-southeast1'>asia-southeast1 (Singapore)</option>
                      <option value='australia-southeast1'>australia-southeast1 (Sydney)</option>
                      <option value='europe-north1'>europe-north1 (Finland)</option>
                      <option value='europe-west1'>europe-west1 (Belgium)</option>
                      <option value='europe-west2'>europe-west2 (London)</option>
                      <option value='europe-west3'>europe-west3 (Frankfurt)</option>
                      <option value='europe-west4'>europe-west4 (Netherlands)</option>
                      <option value='europe-west6'>europe-west6 (Zürich)</option>
                      <option value='northamerica-northeast1'>northamerica-northeast1 (Montréal)</option>
                      <option value='southamerica-east1 '>southamerica-east1 (São Paulo)'</option> */}
                      <option value='us-central1'>us-central1 (Iowa)</option>
                      <option value='us-east1'>us-east1 (South Carolina)</option>
                      <option value='us-east4'>us-east4 (Northern Virginia)</option>
                      <option value='us-west1'>us-west1 (Oregon)</option>
                      <option value='us-west2'>us-west2 (Los Angeles)</option>
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
