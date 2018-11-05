# ali-oss-deploy-with-version

## install

1. clone this repo, and require `./index.js`

2. `npm install --save-dev ali-oss-deploy-with-version`

3. `yarn add --dev ali-oss-deploy-with-version`

## usage

```
const deploy2OSS = require("../index")
const OSS = require("ali-oss")
const path = require("path")

const OSSClient = new OSS({
  region: "",
  bucket: "",
  accessKeyId: "",
  accessKeySecret: ""
})
const currentVersion = '20181106'

deploy2OSS(OSSClient, {
  localFolderPath: path.resolve(__dirname, "../dist"),
  aliOSSBasePath: "/demo/",
  aliOSSFolderName: currentVersion,
  filesAlsoCopy2Base: [/\.html/],
  extendedFiles: [
    {
      filename: "info.json",  // relative to aliOSSBasePath
      content: `{currentVersion:${currentVersion}}`
    },
    {
      filename: "test/index.txt",
      content: 'hello world!'
    }
  ]
})
```

local files:

```
dist/
  |-- hello/
    |-- hi.js
  |-- index.html
  |-- index.js
```

files deployed with version `20181106` on ali-oss:

```
demo/
  |-- 20181106/
    |-- hello/
      |-- hi.js
    |-- index.html
    |-- index.js
  |-- test/
    |-- index.txt
  |-- index.html
  |-- info.json
```

## API

### deploy2OSS

```
const deploy2OSS = require("../index")
// Or require from package
const deploy2OSS = require("ali-oss-deploy-with-version")

deploy2OSS(aliOSSInstance, options)
```

**aliOSSInstance:**

```
const OSS = require("ali-oss")
const aliOSSInstance = new OSS({
  region: "",
  bucket: "",
  accessKeyId: "",
  accessKeySecret: ""
})
```

**options:**

- localFolderPath:
  Mandatory.
- aliOSSBasePath:
  Mandatory.
- aliOSSFolderName:
  Mandatory.
- filesAlsoCopy2Base:
  Optional.
  `Array<RegExp>`. Files matched RegExp will copy to aliOSSBaseFolder.
- extendedFiles:
  Optional.
  `Array<Object>`. Define content will be created and upload to ali-oss.Each element has property `filename` and `content`.`filename` is path relative to aliOSSBasePath.
