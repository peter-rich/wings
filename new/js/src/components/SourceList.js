import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { ANNOTATE_TYPES, BASE_API_URL, API_ROUTES } from '../constants'
import _ from 'lodash'
import MC from "materialize-css"
import convertAnnoFieldsToString from '../utils/convertAnnoFieldsToString'

const baseBadgeStyles = {
  fontWeight: '300',
  fontSize: '1rem',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderRadius: '2px',
  padding: '5px',
  marginRight: '7px',
  marginBottom: '7px',
  display: 'inline',
  float: 'left',
  cursor: 'pointer',
  transition: '0.1s all ease-in'
}
const styles = {
  error: 'tomato',
  row: {
    position: 'relative'
  },
  expandBtn: {
    position: 'absolute',
    right: 0,
    border: 'none',
    background: 'none',
    cursor: 'pointer'
  },
  badge_selected: Object.assign({}, baseBadgeStyles, {
    color: '#fff',
    borderColor: 'none',
    backgroundColor: '#26a69a'
  }),
  badge_not_selected: Object.assign({}, baseBadgeStyles, {
    color: '#000',
    borderColor: '#26a69a',
    backgroundColor: '#fff'
  }),
  contentBody: {
    overflowWrap: 'break-word',
  },
  selectedCount: {
    color: '#26a69a',
    paddingBottom: '1px',
    borderBottom: '2px solid #26a69a',
    marginLeft: '2rem'
  },
  selectedEmpty: {
    color: '#111',
    paddingBottom: '1px',
    borderBottom: '2px solid #111',
    marginLeft: '2rem'
  }
}
class SourceList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sources: [],
      selected: false,
      selectedFields: [],
      fetched: false,
      annotatedFields: {},
      annotatedFieldsString: ''
    }
    this._toggleTab = this._toggleTab.bind(this)
    this._selectField = this._selectField.bind(this)
    this._deselectField = this._deselectField.bind(this)
  }

  componentDidMount() {
    MC.AutoInit()
    const { name } = this.props
    fetch(`${BASE_API_URL}${API_ROUTES.ANNOTATION_LIST}/${name}`, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(json => {
      json = json.map(item => {
        let newItem = Object.assign({}, item)
        const item_key = Symbol(null)
        newItem.source_name = newItem.source_name !== null ? newItem.source_name : item_key
        newItem.source_link = newItem.source_link !== null ? newItem.source_link : item_key
        newItem.bigquery_table = newItem.bigquery_table !== null ? newItem.bigquery_table : item_key
        let fields = []
        if (newItem.fields !== null) {
          fields = newItem.fields.split(',').map(field => {
            return {
              value: field.trim(),
              selected: false
            }
          })
        }
        newItem.fields = fields
        newItem.selected_fields = []
        return newItem
      })
      this.setState(Object.assign({}, this.state, { sources: json, fetched: true }))
    })
  }

  componentDidUpdate() {
    MC.AutoInit()
  }

  _toggleTab = (index) => {
    if (index === this.state.selected) {
      this.setState(Object.assign({}, this.state, {
        selected: false
      }))
    } else{
      this.setState(Object.assign({}, this.state, {
        selected: index
      }))
    }
    this.props.onChange({
      target: {
        type : 'annotate_fields_picker',
        name: this.props.name,
        value: this.state.annotatedFieldsString
      }
    })
  }

  _selectField = (table, source_name, selected_field) => {
    let newState = Object.assign({}, this.state)
    if (!newState.annotatedFields[table]) {
      newState.annotatedFields[table] = []
    }
    newState.annotatedFields[table].push(selected_field.value)
    newState.sources = newState.sources.map(source => {
      if (source.source_name !== source_name) return source
      const newFields = source.fields.map(field => {
        if (field.value !== selected_field.value) return field
        field.selected = true
        source.selected_fields.push(field.value)
        return field
      })
      source.fields = newFields
      return source
    })
    newState.annotatedFieldsString = convertAnnoFieldsToString(newState.annotatedFields)
    this.setState(newState)
    this.props.onChange({ target: { type : 'annotate_fields_picker', name: this.props.name, value: newState.annotatedFieldsString } })
  }

  _deselectField = (table, source_name, field_to_move) => {
    let newState = Object.assign({}, this.state)
    _.remove(newState.annotatedFields[table], field => field === field_to_move.value )
    newState.sources = newState.sources.map(source => {
      if (source.source_name !== source_name) return source
      const newFields = source.fields.map(field => {
        if (field.value !== field_to_move.value) return field
        field.selected = false
        _.remove(source.selected_fields, field => field === field_to_move.value )
        return field
      })
      source.fields = newFields
      return source
    })
    if (newState.annotatedFields[table].length === 0) {
      delete newState.annotatedFields[table]
    }
    newState.annotatedFieldsString = convertAnnoFieldsToString(newState.annotatedFields)
    this.setState(newState)
    this.props.onChange({ target: { type : 'annotate_fields_picker', name: this.props.name, value: newState.annotatedFieldsString } })
  }

  render() {
    const { sources, selected, fetched, annotatedFieldsString } = this.state
    const { title, hasError, errorMsg } = this.props
    return (
      <>
        <div>{annotatedFieldsString}</div>
        <h5 className='header' style={ hasError ? {color: styles.error} : {} }>{title}</h5>
        { hasError &&
          <span style={{ color: styles.error }} className='helper-text'>{errorMsg}</span>
        }
        { fetched ?
          <ul className="collapsible">
            { sources.map((source, i) => (
              <li key={i}>
                <div style={{ backgroundColor: selected === i ? '#eee' : '#fff', wordBreak: 'break-all' }}
                  className="collapsible-header"
                  onClick={() => { this._toggleTab(i) } }>
                  <i className="material-icons">{selected === i ? 'expand_less' : 'expand_more'}</i>
                  { typeof source.bigquery_table === 'symbol' ? '___Null___': source.bigquery_table }
                  <span style={ source.selected_fields.length > 0 ? styles.selectedCount : styles.selectedEmpty }
                    className='right'>
                    {`${source.selected_fields.length} fields selected: ${source.selected_fields.join(', ')}`}
                  </span>
                </div>
                <div className="collapsible-body clearfix"
                  style={styles.contentBody}>
                  <>
                    { source.fields
                      .map( (field, j) => {
                        return (
                          field.selected ?
                          <span key={j} style={styles.badge_selected}>
                            {field.value}
                            <i className="tiny material-icons"
                              onClick={() => {
                                this._deselectField(source.bigquery_table, source.source_name, field)
                              }
                            }>close</i>
                          </span>
                          :
                          <span key={j} style={styles.badge_not_selected}
                            onClick={() => { this._selectField(source.bigquery_table, source.source_name, field) } }>
                            {field.value}
                          </span>
                        )}
                      )
                    }
                  </>
                </div>
              </li>
            ))}
          </ul>
          :
          <div className="progress">
            <div className="indeterminate"></div>
          </div>
        }
      </>
    )
  }
}

SourceList.propTypes = {
  name: PropTypes.oneOf(ANNOTATE_TYPES).isRequired,
  hasError: PropTypes.bool.isRequired,
  errorMsg: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default SourceList