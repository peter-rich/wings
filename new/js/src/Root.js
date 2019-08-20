import React from "react";
import { BrowserRouter as Router, Redirect, Switch, Route } from "react-router-dom";
import Home from './Home'
import MainLayout from './layouts/MainLayout'
import FastqToSamContainer from './components/MiniApp/FastqToSamContainer'

function Root() {
  const NoMatch = Home
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route
          path="/api"
          render={({ match: { url } }) => (
            <MainLayout>
              <Route path={`${url}/home`} component={FastqToSamContainer} />
              <Route path={`${url}/users`} component={FastqToSamContainer} />
              <Redirect from='*' to='/' />
            </MainLayout>
          )}
        />
        {/* <Route path="/" component={MainLayout}>
          <Route exact path="/" component={Home} />
          <Route path="/jobs" component={FastqToSamContainer} />
          <Route path="/jobs"
            render={(match) => (
              <>
                <Route path={"xxxxx"} component={FastqToSamContainer} />
              </>
            )}
          />
        </Route> */}
        <Redirect from='*' to='/' />
      </Switch>
    </Router>
  )
}

export default Root