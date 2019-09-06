import React from 'react'
import PropTypes from 'prop-types'

const Popup = ({ onClose, children }) => (
  <div style={{ backgroundColor: 'orange' }}>
    <button onClick={onClose}>
      <i className="material-icons">close</i>
    </button>
    {children}
  </div>
)

Popup.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.element
}

export default Popup