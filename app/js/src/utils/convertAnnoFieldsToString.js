const convertAnnoFieldsToString = (fields) => {
  return Object.keys(fields).map(key => {
    return key + ':' + fields[key].join(':')
  }).join(',')
}

export default convertAnnoFieldsToString