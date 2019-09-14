import PropTypes from 'prop-types'

const fieldShape = {
  key: PropTypes.string,
  type: PropTypes.oneOf(['text', 'checkbox', 'radio', 'dropdown', 'annotationFieldsPicker']),
  rules: PropTypes.arrayOf(PropTypes.oneOf(['required', 'gsLink', 'bamFile', 'vcfFile'])),
  options: PropTypes.arrayOf(PropTypes.string),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  title: PropTypes.string,
}

export default fieldShape