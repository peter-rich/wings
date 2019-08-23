import React from 'react'
import { Route } from "react-router-dom";
import Nav from '../components/Nav'

const MainLayout = ({children, ...rest}) => {
  return (
    <div>
      <Nav />
      <div className="container">
        {children}
      </div>
    </div>
  )
}

const MainLayoutRoute = ({ component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <MainLayout>
        <Component {...matchProps} />
      </MainLayout>
    )} />
  )
}

export default MainLayoutRoute