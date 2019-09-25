util = {}

util.trimTrailingChar = (string, char) => {
  if (string.charAt(string.length-1) === char) {
    return string.slice(0, -1)
  }
  return string
}
module.exports = util