import React from "react";
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";
import MainLayoutRoute from './layouts/MainLayoutRoute'
import FastqToSamContainer from './components/MiniApp/FastqToSamContainer'
import GATKContainer from './components/MiniApp/GATKContainer'
import MonitorPage from './pages/MonitorPage'
import Home from './Home'
import { PUBLIC_ROUTES } from './config.json'

function Root() {
  return (
    <Router>
      <Switch>
        <MainLayoutRoute exact path="/" component={Home} />
        <MainLayoutRoute
          path={PUBLIC_ROUTES.FASTQ_TO_SAM}
          component={FastqToSamContainer}/>
        <MainLayoutRoute
          path={PUBLIC_ROUTES.FASTQ_TO_SAM_50G}
          component={FastqToSamContainer}/>
        <MainLayoutRoute
          path={PUBLIC_ROUTES.GATK}
          component={GATKContainer}/>
        <MainLayoutRoute
          path={PUBLIC_ROUTES.MONITOR}
          component={MonitorPage}/>
        <Redirect from='*' to='/' />
      </Switch>
    </Router>
  )
}

export default Root