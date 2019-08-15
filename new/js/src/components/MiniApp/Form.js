import React, { Component } from 'react'
import PropTypes from 'prop-types'
import fieldShape from './fieldShape'
import _ from 'lodash'

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
    this.setState(newState)
  }

  _onSubmit = (e) => {
    e.preventDefault()
    console.table(this.state.formData)
    const data = {}
    Object.keys(this.state.formData).forEach(key => {
      data[key] = this.state.formData[key].value
    })
    fetch('/api/fastqtosam', {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(json => console.log(json))
  }

  render() {
    const { title, fields } = this.props
    return (
      <div className="row">
        <h1>{title}</h1>
        <form onSubmit={this._onSubmit}
          className="col s12 m8 push-m2 l10 push-l1">
          {/* <div className="row">
            <div className="input-field col s12">
              <label htmlFor="timezone">Time Zone</label>
              <select name="time_zone"
                className="browser-default"
                onChange={this._onChange}>
                <option value="" disabled selected>----------------------------------------------------------------------------------------------------------------------------------------------------------------</option>
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
          </div> */}
          { fields.map((field,i) =>{
            if (field.key === 'time_zone') {
              return (
                <div className="row">
                  <div className="input-field col s12">
                    <label htmlFor={field.key}>{field.title}</label>
                    <select name={field.key}
                      className="browser-default"
                      onChange={this._onChange}>
                      <option value="" disabled selected>----------------------------------------------------------------------------------------------------------------------------------------------------------------</option>
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
                <div className="row">
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
          {/* <div className="row">
            <div className="input-field col s12">
              <label htmlFor="log_file">Log File. For example, "gs://genomics-public-data/logs"</label>
              <input name="log_file"
                type="text"
                className="validate"
                onChange={this._onChange} />
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <label htmlFor="sample_name">Sample Name</label>
              <input name="sample_name"
                type="text"
                className="validate"
                onChange={this._onChange} />
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <label htmlFor="read_group">Read Group. For example, "RG0"</label>
              <input name="read_group"
                type="text"
                className="validate"
                onChange={this._onChange} />
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <label htmlFor="platform">Platform. For example, "illumina"</label>
              <input name="platform"
                type="text"
                className="validate"
                onChange={this._onChange} />
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <label htmlFor="input_file_1">Input File 1. For example, "gs://genomics-public-data/platinum-genomes/fastq/ERR194159_1.fastq.gz"</label>
              <input name="input_file_1"
                type="text"
                className="validate"
                onChange={this._onChange} />
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <label htmlFor="input_file_2">Input File 2. For example, "gs://genomics-public-data/platinum-genomes/fastq/ERR194159_2.fastq.gz"</label>
              <input name="input_file_2"
                type="text"
                className="validate"
                onChange={this._onChange} />
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <label htmlFor="output_file">Output File</label>
              <input name="output_file"
                type="text"
                className="validate"
                onChange={this._onChange} />
            </div>
          </div> */}
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
  fields: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.shape(fieldShape))),
}

export default Form
