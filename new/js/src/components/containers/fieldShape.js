import PropTypes from 'prop-types'

const fieldShape = {
  key: PropTypes.string,
  type: PropTypes.oneOf(['text', 'checkbox']),
  title: PropTypes.string,
  required: PropTypes.bool
}

export default fieldShape