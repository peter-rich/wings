import React, { Component } from "react";
import Table from '../components/Table'
import { BASE_API_URL } from '../Constant'

const API_ROUTE = 'monitor'

class MonitorPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jobs: [],
      dataFetched: false,
      dataEmpty: false
    }
    this._asyncRequest = this._asyncRequest.bind()
  }

  _asyncRequest = () => {
    fetch(`${BASE_API_URL}/${API_ROUTE}`, {
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
    this._asyncRequest()
  }

  componentWillUnmount() {
    new AbortController().abort()
  }

  render () {
    const { jobs, dataFetched } = this.state
    return (
      <Table loading={!dataFetched} records={jobs} />
    )
  }
}

export default MonitorPage