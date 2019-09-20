import React, { Component } from 'react'
import PropTypes from 'prop-types'
import fieldShape from './fieldShape'
import SourceList from '../SourceList'
import _ from 'lodash'
import { BASE_API_URL } from '../../constants'
import MC from 'materialize-css'


const styles = {
  error: 'tomato'
}


let initialState = {}


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
    initialState.formData = initialFormData
    initialState.hasFormResult = false
    initialState.formResult = ''
    initialState.isFormValid = false
    initialState.isSubmitting = false
    initialState.totalGroups = props.fields.length
    initialState.activeGroup = 0
    this.state = initialState
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
        // case 'oneOfMoreFields':
        //   newBase.isValid = value.length > 0
        //   newBase.errorMsg = newBase.isValid ? '' : 'Click on previous/next panel. At least 1 field needs to be selected.'
        //   break
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
    } else if (['text'].includes(fieldType)){
      const newField = this._updateFormdata(newState.formData[fieldName], e.target.value)
      newState.formData[fieldName] = newField
    } else if (fieldType === 'annotationFieldsPicker') {
      let newFormData = _.cloneDeep(newState.formData)
      newFormData[fieldName].value = e.target.value
      const annotatedFieldKeys = Object.values(newFormData)
                                .filter( field => field.type === 'annotationFieldsPicker' && field.rules.includes('oneOfMoreFields') )
                                .map(field => field.key)
      const joinedFields = annotatedFieldKeys
                            .map(key => newFormData[key].value)
                            .join('')
                            .trim()
      const isValid = joinedFields.length > 0 ? true : false
      const errorMsg = isValid ? '' : 'Click on previous/next button. At least 1 field needs to be selected.'
      annotatedFieldKeys
        .forEach(key => {
          newFormData[key].isValid = isValid
          newFormData[key].errorMsg = errorMsg
          newFormData[key].touched = true
        })
      newState.formData = newFormData
    } else if (['radio', 'select-one'].includes(fieldType)) {
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

  _resetForm = () => {
    this.setState(initialState)
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
    const { title, fields } = this.props
    // console.log(this.state)
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
                          <p>{formField.title}</p>
                          <select name={formField.key}
                            className="browser-default"
                            onChange={this._onChange}
                            value={formField.value}>
                            { formField.options.map((option, i) =>
                              <option key={i} value={option.key}>{option.displayName}</option>
                            )}
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
                                value={option.key}
                                type='radio'
                                checked={formField.value === option.key}
                                onChange={this._onChange} />
                              <span>{option.displayName}</span>
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
          { isSubmitting &&
            <div className='card-panel'>
              <div className='progress'>
                <div className='indeterminate'></div>
              </div>
            </div>
          }
          { hasFormResult &&
            <div id='formResultBox' className='card-panel' style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '5px', right: '5px', cursor: 'pointer' }}
                onClick={this._resetForm}><i className='material-icons'>close</i></span>
              <p><span style={{ fontWeight: 'bold' }}>Result:</span> {formResult}</p>
            </div>
          }
          <div className='row'>
            <div className='input-field col s12'>
              <button type='submit' name='action'
                className='btn waves-effect waves-light'
                disabled={!isFormValid || isSubmitting}
                onClick={this._onSubmit}>
                { isSubmitting ? 'Submitting ...' : 'Submit Job' }
                { isSubmitting ? <i className='material-icons right'>arrow_upward</i> : <i className='material-icons right'>send</i> }
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
