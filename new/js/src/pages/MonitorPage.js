import React, { Component } from "react";
import Table from '../components/Table'
import { BASE_API_URL, API_ROUTES } from '../constants'

const UPDATE_STARTDATE = 'UPDATE_STARTDATE'
const UPDATE_ENDDATE = 'UPDATE_ENDDATE'
class MonitorPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jobs: [],
      dataFetched: false,
      dataEmpty: false,
      startDate: null,
      endDate: null
    }
    this._getJobs = this._getJobs.bind()
    this._updateJobs = this._updateJobs.bind()
    this._search = this._search.bind()
    this._updateDate = this._updateDate.bind()
  }

  _updateJobs = () => {
    fetch(`${BASE_API_URL}${API_ROUTES.UPDATE_JOBS}`, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(json => {
      if (json.result === 'success') {
        this._getJobs()
      }
    })
  }

  _search = () => {
    const { pathname, search } = this.props.location
    this.props.history.push({
      pathname: pathname,
      search: search
    })

    this._getJobs()
  }

  _updateDate = (date, e) => {
    const url = this.props.location
    const query_string = url.search
    const search_params = new URLSearchParams(query_string)
    if (date === UPDATE_STARTDATE) {
      search_params.set('startdate', e.target.value)
    }
    if (date === UPDATE_ENDDATE) {
      search_params.set('enddate', e.target.value)
    }
    url.search = search_params.toString()
    this.props.history.push({
      pathname: url.pathname,
      search: url.search
    })
  }

  _getJobs = () => {
    fetch(`${BASE_API_URL}/jobs${this.props.location.search}`, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=UTF-8"
      },
    })
    .then(response => response.json())
    .then(json => {
      this.setState(Object.assign({}, this.state, {
        jobs: json.jobs,
        dataFetched: true,
        dataEmpty: !json.jobs.length > 0
      }))
    })
  }

  componentDidMount() {
    this._getJobs()
  }

  componentWillUnmount() {
    new AbortController().abort()
  }

  render () {
    const { jobs, dataFetched } = this.state
    return (
      <>
        <div className="row">
          <div className="input-field col s4">
            <input id="start-date" type="date"
              className="validate"
              onChange={(e) => {this._updateDate(UPDATE_STARTDATE, e)}}/>
            <label htmlFor="start-date">
              <i className="material-icons left">date_range</i>Start date
            </label>
          </div>
          <div className="input-field col s4">
            <input id="end-date" type="date"
              className="validate"
              onChange={(e) => {this._updateDate(UPDATE_ENDDATE, e)}} />
            <label htmlFor="end-date">
              <i className="material-icons left">date_range</i>End date
            </label>
          </div>
          <div className="input-field col s3">
            <button onClick={this._search}
              className="btn waves-effect waves-light">
              <i className="material-icons left">search</i>Search
            </button>
          </div>
          <div className="input-field col s1">
            <button onClick={this._updateJobs}
              className="btn-floating waves-effect waves-light">
              <i className="material-icons left">update</i>
            </button>
            <span>Fetch latest</span>
          </div>
        </div>
        <Table loading={!dataFetched} records={jobs} />
      </>
    )
  }
}

export default MonitorPage