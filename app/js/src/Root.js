import React from "react"
import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom"
import PropTypes from 'prop-types'
import MainProtectedRoute from './layouts/MainProtectedRoute'
import FastqToSamContainer from './components/containers/FastqToSamContainer'
import GATKContainer from './components/containers/GATKContainer'
import CNVnatorContainer from './components/containers/CNVnatorContainer'
import AnnotationImportContainer from './components/containers/AnnotationImportContainer'
import AnnotationVariantProcessContainer from './components/containers/AnnotationVariantProcessContainer'
import MonitorPage from './pages/MonitorPage'
import Home from './Home'
import { PUBLIC_ROUTES } from './constants'

import { Provider } from 'react-redux'

const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Switch>
        <MainProtectedRoute exact path="/" component={Home} />
        <MainProtectedRoute
          path={PUBLIC_ROUTES.FASTQ_TO_SAM}
          component={FastqToSamContainer}/>
        <MainProtectedRoute
          path={PUBLIC_ROUTES.FASTQ_TO_SAM_50G}
          component={FastqToSamContainer}/>
        <MainProtectedRoute
          path={PUBLIC_ROUTES.GATK}
          component={GATKContainer}/>
        <MainProtectedRoute
          path={PUBLIC_ROUTES.CNVNATOR}
          component={CNVnatorContainer}/>
        <MainProtectedRoute
          path={PUBLIC_ROUTES.ANNOTATION_HIVE_IMPORT}
          component={AnnotationImportContainer}/>
        <MainProtectedRoute
          path={PUBLIC_ROUTES.ANNOTATION_HIVE_PROCESS}
          component={AnnotationVariantProcessContainer}/>
        <MainProtectedRoute
          path={PUBLIC_ROUTES.MONITOR}
          component={MonitorPage}/>
        <Redirect from='*' to='/' />
      </Switch>
    </Router>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root