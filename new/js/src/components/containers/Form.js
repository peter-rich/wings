import React, { Component } from 'react'
import PropTypes from 'prop-types'
import fieldShape from './fieldShape'
import SourceList from '../SourceList'
import _ from 'lodash'
import { BASE_API_URL } from '../../constants'
import MC from "materialize-css"


const styles = {
  error: 'tomato'
}

class Form extends Component {
  constructor(props) {
    super(props)
    let initialFormData = {}
    props.fields.flat().forEach(field => {
      const hasDefaultVal = field.defaultValue !== undefined
      initialFormData[field.key] = {
        ...field,
        value: hasDefaultVal ? field.defaultValue : '',
        isValid: hasDefaultVal || false,
        errorMsg: '',
        touched: hasDefaultVal || false
      }
    })
    this.state = {
      formData: initialFormData,
      hasFormResult: false,
      formResult: '',
      isFormValid: false,
      isSubmitting: false,
      totalGroups: props.fields.length,
      activeGroup: 0
    }
    this._onChange = this._onChange.bind(this)
    this._selectGroup = this._selectGroup.bind(this)
    this._onBlur = this._onBlur.bind(this)
    this._updateFormdata = this._updateFormdata.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }

  _selectGroup = (e, group) => {
    e.preventDefault()
    this.setState(Object.assign({}, this.state, { activeGroup: group }))
  }

  _onBlur = (e) => {
    this._onChange(e)
  }

  _updateFormdata = (baseField, value) => {
    let newBase = _.cloneDeep(baseField)
    newBase.value = value
    newBase.touched = true
    newBase.isValid = !!value.length
    for (let rule of newBase.rules) {
      switch (rule) {
        case 'required':
          newBase.isValid = value.trim().length > 0
          newBase.errorMsg = newBase.isValid ? '' : 'This field is required'
          break
        case 'fieldRequired':
          newBase.isValid = value.trim().length > 0
          newBase.errorMsg = newBase.isValid ? '' : 'At least 1 field needs to be selected'
          break
        case 'gsLink':
          newBase.isValid = value.startsWith('gs://')
          newBase.errorMsg = newBase.isValid ? '' : 'You should be providing a "gs://" link'
          break
        case 'bamFile':
          newBase.isValid = value.endsWith('.bam')
          newBase.errorMsg = newBase.isValid ? '' : 'You should be providing a ".bam" files'
          break
        case 'vcfFile':
          newBase.isValid = value.endsWith('.vcf')
          newBase.errorMsg = newBase.isValid ? '' : 'You should be providing a ".vcf" files'
          break
        default:
          break
      }
      if (!newBase.isValid) {
        break
      }
    }
    return newBase
  }

  _onChange = (e) => {
    let newState = _.cloneDeep(this.state)
    const fieldName = e.target.name
    const fieldType = e.target.type
    if (fieldType === 'checkbox') {
      newState.formData[fieldName].value = !!e.target.checked
    } else if (['annotate_fields_picker', 'text'].includes(fieldType)){
      const newField = this._updateFormdata(newState.formData[fieldName], e.target.value)
      newState.formData[fieldName] = newField
    } else if (['radio', 'dropdown'].includes(fieldType)) {
      newState.formData[fieldName].value = e.target.value
    }
    newState.formData[fieldName].touched = true
    newState.isFormValid = Object.values(newState.formData).reduce((flag, obj) => {
      return flag && obj.touched && obj.isValid
    }, true)
    this.setState(newState)
  }

  _onSubmit = (e) => {
    e.preventDefault()
    const formData = {}
    Object.keys(this.state.formData).forEach(key => {
      formData[key] = this.state.formData[key].value
    })
    const { API_ROUTE } = this.props
    this.setState(Object.assign({}, this.state, { isSubmitting: true }))
    fetch(`${BASE_API_URL}${API_ROUTE}`, {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(json => {
      if (json.success === true) {
        this.setState(Object.assign({}, this.state, {
          hasFormResult: true,
          formResult: json.result,
          isSubmitting: false
        }))
      } else {
        this.setState(Object.assign({}, this.state, {
          hasFormResult: true,
          formResult: json.error,
          isSubmitting: false
        }))
      }
    })
  }

  componentDidMount() {
    MC.AutoInit()
  }

  render() {
    const {
      isFormValid,
      isSubmitting,
      activeGroup,
      totalGroups,
      hasFormResult,
      formResult,
      formData
    } = this.state
    const { title,
      fields } = this.props
    console.log(this.state)
    return (
      <div className="row">
        <form onSubmit={this._onSubmit}
          className='col s12 m10 push-m1'>
          <h3 className="header">{title}</h3>
          { totalGroups > 1 &&
            <div className="row">
              <div className="input-field col s12">
                <button type="submit" name="action"
                  className="btn waves-effect waves-light"
                  disabled={activeGroup === 0}
                  onClick={(e) => { this._selectGroup(e, activeGroup-1) } }>
                  Previous<i className="material-icons left">arrow_left</i>
                </button>
                <button type="submit" name="action"
                  className="btn waves-effect waves-light right"
                  disabled={activeGroup === totalGroups-1}
                  onClick={(e) => { this._selectGroup(e, activeGroup+1) } }>
                  Next<i className="material-icons right">arrow_right</i>
                </button>
              </div>
            </div>
          }
          { fields.map((group, i) => {
            return (
              <div key={i} style={{ display: i===activeGroup ? 'block' : 'none'}}>
                <>
                { group.flat().map((field,i) =>{
                  const formField = formData[field.key]
                  const { touched, isValid, errorMsg } = formField
                  const hasError = !!(touched && !isValid)
                  if (formField.type === 'dropdown') {
                    return (
                      <div key={i} className="row">
                        <div className="input-field col s12">
                          <select name={formField.key}
                            className="browser-default"
                            onChange={this._onChange}
                            value={formField.value}>
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
                  } else if (formField.type === 'checkbox') {
                    return (
                      <div key={i} className='row'>
                        <div className='input-field col s12'>
                          <div key={i} className='switch'>
                            <label>
                              <input type='checkbox'
                                name={formField.key}
                                className='filled-in'
                                checked={formField.value}
                                onChange={this._onChange} />
                              <span>{formField.title}</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )
                  } else if (formField.type === 'radio') {
                    return (
                      <div key={i} className='row'>
                        <div className='col s12'>
                          <span>{formField.title}</span>
                          { formField.options.map((option,i) => (
                            <label key={i} style={{ margin: '0 1rem' }}>
                              <input name={formField.key}
                                value={option}
                                type='radio'
                                checked={formField.value === option}
                                onChange={this._onChange} />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  } else if (formField.type === 'annotationFieldsPicker') {
                    return (
                      <div key={i}>
                        <SourceList
                          hasError={hasError}
                          errorMsg={errorMsg}
                          name={formField.key}
                          title={formField.title}
                          onChange={this._onChange}/>
                        <br />
                        <br />
                      </div>
                    )
                  } else {
                    return (
                      <div key={i} className='row'>
                        <div className='input-field col s12'>
                          <label htmlFor={`form-field-${formField.key}`}>{formField.title}</label>
                          <input id={`form-field-${formField.key}`}
                            style={ hasError ? { borderColor: styles.error, color: styles.error} : {} }
                            name={formField.key}
                            value={formField.value}
                            type='text'
                            onBlur={this._onBlur}
                            onChange={this._onChange} />
                        </div>
                        { hasError &&
                          <span style={{ color: styles.error, padding: '0 0.75rem' }}
                            className='helper-text'>{errorMsg}</span>
                        }
                      </div>
                    )
                  }
                })}
                </>
              </div>
            )
          })}
          { hasFormResult &&
            <blockquote>
              <p>{formResult}</p>
            </blockquote>
          }
          <div className="row">
            <div className="input-field col s12">
              <button type="submit" name="action"
                className="btn waves-effect waves-light"
                disabled={!isFormValid || isSubmitting}
                onClick={this._onSubmit}>
                { isSubmitting ? 'Submitting ...' : 'Submit Job' }
                { isSubmitting ? <i className="material-icons right">arrow_upward</i> : <i className="material-icons right">send</i> }
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
  fields: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape(fieldShape))),
}

export default Form
