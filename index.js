const fs = require("fs")
const path = require("path")
const chalk = require("chalk")
const readdir = require("fs-readdir-recursive")
const {
  joinPath,
  consoleError,
  consoleHeart,
  consoleInfo,
  consoleSuccess,
  everyPromisesEqTrue
} = require("./utils")

/**
 * upload single file to ali-oss
 * @param {string} aliOSSFilePath file path in ali-oss
 * @param {string} filePath local file path
 */
function uploadFile2AliOSS(OSSClient, aliOSSFilePath, filePath) {
  return OSSClient.put(aliOSSFilePath, filePath).then(
    res => {
      if (res.res.status !== 200) {
        consoleError(`${res.name} upload failed!`)
      } else {
        consoleSuccess(`${res.name} upload success!`)
        return true
      }
    },
    err => {
      if (err) {
        console.log(err)
        err && consoleError("upload Error:", err)
      }
    }
  )
}

/**
 * this function upload extended files with extendedFiles option function deploy2OSS recieved
 * @param {[]Object} extendedFiles options from deploy2OSS recieved param
 * @param {Object} OSSClient
 * @param {string} aliOSSBasePath
 * @return {[]Promise}  return Promise to resolve weather all file upload success
 */
function uploadExtendedFiles2AliOSS(extendedFiles, OSSClient, aliOSSBasePath) {
  const promises = extendedFiles.map(conf => {
    return OSSClient.put(
      joinPath(aliOSSBasePath, conf.filename),
      new Buffer(conf.content)
    ).then(res => {
      if (res.res.status !== 200) {
        consoleError(`extended file ${conf.filename} upload fail!`)
      } else {
        consoleSuccess(`extended file ${conf.filename} upload success!`)
        return true
      }
    })
  })
  return everyPromisesEqTrue(promises).then(res => {
    if (res) {
      consoleHeart(`all job is done!`)
      return true
    }
  })
}

function deploy2OSS(OSSClient, options) {
  const { bucket, region } = OSSClient.options
  consoleInfo("current bucket: ", bucket)
  consoleInfo("current region: ", region)

  const {
    aliOSSBasePath,
    aliOSSFolderName,
    filesAlsoCopy2Base,
    localFolderPath,
    extendedFiles
  } = options
  const aliOSSFolderPath = aliOSSBasePath
    .split("/")
    .concat(aliOSSFolderName)
    .reduce((pv, cv) => pv + (cv === "" ? "" : `${cv}/`), "")
  consoleInfo("aliyun OSS output path：", aliOSSFolderPath)
  consoleInfo("your computer folder path：", localFolderPath)

  const uploadPromses = []
  try {
    readdir(localFolderPath).forEach(file => {
      const aliOSSFilePath = joinPath(aliOSSFolderPath, file)
      const filePath = path.resolve(localFolderPath, file)
      uploadPromses.push(uploadFile2AliOSS(OSSClient, aliOSSFilePath, filePath))
      const isAlsoCopy2BaseFile =
        filesAlsoCopy2Base &&
        filesAlsoCopy2Base.some(regexp => new RegExp(regexp).test(file))
      if (isAlsoCopy2BaseFile) {
        const alsoCopy2BaseAliOSSFilePath = joinPath(aliOSSBasePath, file)
        uploadPromses.push(
          uploadFile2AliOSS(OSSClient, alsoCopy2BaseAliOSSFilePath, filePath)
        )
      }
    })
  } catch (err) {
    consoleError(err)
  }

  // check all upload
  everyPromisesEqTrue(uploadPromses).then(isSuccess => {
    if (!isSuccess) {
      consoleError(`not all file upload success!!`)
      return
    }
    consoleHeart(`all local file uploaded success!`)
    if (extendedFiles && extendedFiles.length) {
      return uploadExtendedFiles2AliOSS(
        extendedFiles,
        OSSClient,
        aliOSSBasePath
      )
    } else {
      consoleHeart(`all job is done!`)
      return Promise.resolve(true)
    }
  })
}

module.exports = deploy2OSS
