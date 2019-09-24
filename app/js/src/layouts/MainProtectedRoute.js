import React from 'react'
import { Route } from "react-router-dom"
import Auth from '../components/Auth'
import Nav from '../components/Nav'
import { connect } from 'react-redux'


const MainLayout = ({children, ...rest}) => {
  const { user } = rest
  return (
    <div>
      <Nav />
      <div className="container">
        { user ?
          children :
          <Auth />
        }
      </div>
    </div>
  )
}
const mapStateToProps = state => ({
  user: state.auth.user
})
const MainLayoutWithState = connect(mapStateToProps)(MainLayout)

const MainProtectedRoute = ({ component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <MainLayoutWithState>
        <Component {...matchProps} />
      </MainLayoutWithState>
    )} />
  )
}

export default MainProtectedRoute