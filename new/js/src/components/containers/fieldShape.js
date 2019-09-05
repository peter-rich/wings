import PropTypes from 'prop-types'

const fieldShape = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
}

export default fieldShape