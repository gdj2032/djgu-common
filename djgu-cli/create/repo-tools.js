const inquirer = require('inquirer')
const fs = require('fs-extra')
const path = require('path')
const ora = require('ora')
const yaml = require('yaml')
const bluebird = require('bluebird')
const downloadUrl = require('download')
const gitclone = require('git-clone')
const rm = require('rimraf').sync

const noop = () => {}

const log = msg => console.log(msg)

/**
 * 选择客户端模板
 */
const choiceClientTpl = () => {
  const config = yaml.parse(fs.readFileSync(path.join(__dirname, 'templates.yml'), 'utf8'))
  const question = [
    {
      type: 'list',
      name: '模板类型',
      message: '请选择要创建的应用模板',
      choices: config.generators.map(_obj => ({
        name: _obj.name,
        value: _obj.repo,
      })),
    },
  ]
  return inquirer
    .prompt(question)
    .then((answer) => {
      return answer['模板类型']
    })
}

/**
 * 格式化git地址，用于匹配远程git地址
 * @param {string} dist git地址
 */
const formatGit = (dist) => {
  let _res = dist.match(/^git@(.+):(.+)\/(.+)\.git(#(.+))?/, 'i')
  if (_res) {
    return {
      host: _res[1],
      group: _res[2],
      project: _res[3],
      branch: _res[5] || 'master',
    }
  } else {
    return null
  }
}

/** 
 * 下载函数
 */
const download = (url, dest, opts = {}, fn = noop) => {
  const clone = opts.clone || false

  if (clone) {
    const repo = formatGit(url)
    if (!repo) {
      fn('git clone repository format is error!')
      return
    }
    gitclone(url, dest, { checkout: repo.branch, shallow: repo.branch === 'master' }, (err) => {
      if (!err) {
        rm(dest + '/.git')
      }
      fn(err)
    })
  } else {
    downloadUrl(url, dest, { extract: true, strip: 1, mode: '666', headers: { accept: 'application/zip' } })
      .then(() => {
        fn()
      })
      .catch((err) => {
        fn(err)
      })
  }
}

/** 
 * 下载模板仓库
 * @param {string} repo git地址
 */
const downloadRepo = (repo, dstDir) => {
  return new bluebird((resolve) => {
    const spinner = ora(`Downloading project from ${repo}`).start()
    const tempDir = path.resolve(dstDir, '.repoTemp');
    fs.emptyDirSync(tempDir);
    download(repo, tempDir, { clone: true }, (err) => {
      if (err) {
        spinner.fail('Download Failed!')
        throw err
      } else {
        spinner.succeed('Download Successful!')
        fs.copySync(tempDir, dstDir);
        fs.removeSync(tempDir);
        //fs.removeSync(path.resolve(process.cwd(), '.yuna-create-app-templates'));
        resolve(dstDir)
      }
    })
  })
}

/** 
 * 覆盖文件夹
 * @param {string} 源路径
 * @param {string} 目标路径
 * @param {string} 需要更新的文件
 */
const updateFolder = (srcPath, distPath, file) => {
  const src = file ? path.resolve(srcPath, file) : srcPath
  const dist = file ? path.resolve(distPath, file) : distPath
  fs.copySync(src, dist)
}

module.exports = {
  choiceClientTpl,
  downloadRepo,
  updateFolder,
  log,
}
