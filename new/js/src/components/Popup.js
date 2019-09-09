import React from 'react'
import PropTypes from 'prop-types'

const styles = {
  main: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    margin: 'auto',
    backgroundColor: 'rgba(0,0,0, 0.5)',
  },
  inner: {
    position: 'absolute',
    left: '25%',
    right: '25%',
    top: '25%',
    bottom: '25%',
    margin: 'auto',
    borderRadius: '20px',
    background: 'white',
  }
}
const Popup = ({ closePopup, children }) => (
  <div style={styles.main}>
    <div style={styles.inner}>
      <button onClick={closePopup}>close me</button>
      {children}
    </div>
  </div>
)

Popup.propTypes = {
  closePopup: PropTypes.func.isRequired,
  children: PropTypes.element
}

export default Popup