import React, { Component } from 'react';
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { BRAND_URL } from '../constants'
import { requestUser } from '../datastore/auth/authAction'

class Nav extends Component {
  componentDidMount() {
    this.props.dispatch(requestUser())
  }

  render() {
    const { user } = this.props
    return (
      <nav style={{ marginBottom: '1.5rem' }}>
        <div className="nav-wrapper">
          <a href={BRAND_URL}
            target='_blank'
            rel='noopener noreferrer'
            className="brand-logo">
            <img src="/images/logo.png" alt='stanford bioinformatics logo' />
            Stanford Genetics
          </a>
          <ul id='nav-mobile' className="right hide-on-med-and-down">
            { user ?
              <li style={{ backgroundColor: '#26a69a', padding: '0 10px' }}>Project ID: {user.project_id}</li>
              :
              <li style={{ backgroundColor: '#ffab40', padding: '0 10px' }}>Please Log In</li>
            }
            <li><NavLink to='/'>Apps</NavLink></li>
            <li><NavLink to='/monitor'>Monitor</NavLink></li>
          </ul>
        </div>
      </nav>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user
})

export default connect(mapStateToProps)(Nav)
