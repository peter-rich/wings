import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

class MiniApp extends Component {
  render() {
    const { title, description, link } = this.props
    return (
      <div className="card">
        <div className="card-content">
          <span className="card-title">{title}</span>
          <p>{description}</p>
        </div>
        <div className="card-action">
          <NavLink to={link}>Start</NavLink>
        </div>
      </div>
    )
  }
};

MiniApp.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
}

export default MiniApp;