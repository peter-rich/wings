import React, { Component } from 'react'
import { Link } from "react-router-dom";
import Nav from '../components/Nav'

class MainLayout extends Component {
  render() {
    return (
      <div>
        <Nav />
        {this.props.children}
      </div>
    )
  }
}

export default MainLayout