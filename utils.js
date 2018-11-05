const chalk = require("chalk")

function joinPath(...args) {
  const joinedPath = args
    .join("/")
    .split("/")
    .reduce((pv, cv) => pv + (cv === "" ? "" : `${cv}/`), "")
  const joinedPathLen = joinedPath.length
  return joinedPathLen ? joinedPath.slice(0, joinedPathLen - 1) : joinedPath
}

const emojiInfo = "ℹ️"
const emojiSuccess = "✅"
const emojiError = "❌"
const emojiHeart = "❤️"

function consoleInfo(title, ...msg) {
  console.log(chalk.blue(`${emojiInfo}  ${title}`), ...msg)
}

function consoleSuccess(msg) {
  console.log(chalk.green(`${emojiSuccess}  ${msg}`))
}

function consoleError(msg) {
  console.log(chalk.red(`${emojiError}  ${msg}`))
}

function consoleHeart(msg) {
  console.log(chalk.green(`${emojiHeart}  ${msg}`))
}

/**
 * check every Array<Promise> element is true
 * @param {[]Promise} promises
 * @return {Promise} Promise with boolean
 */
function everyPromisesEqTrue(promises) {
  return Promise.all(promises).then(resArr => {
    if (resArr.every(isSuccess => isSuccess === true)) {
      return true
    }
  })
}

module.exports = {
  joinPath,
  consoleInfo,
  consoleSuccess,
  consoleError,
  consoleHeart,
  everyPromisesEqTrue
}
