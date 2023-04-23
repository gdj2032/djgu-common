const chalk = require('chalk')
const path = require('path')
const figlet = require('figlet')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const readline = require('readline')
const yaml = require('yaml')
const repoTools = require('./repo-tools')
const ora = require('ora')
const uf = require('unique-filename');
const merge = require('lodash.merge');

const choiceClientTpl = () => {
  const config = yaml.parse(fs.readFileSync(path.join(__dirname, 'templates.yml'), 'utf8'))
  const question = [
    {
      type: 'list',
      name: 'tplType',
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
      return answer.tplType
    })
}



function setAppInfo() {
  const question = [
    {
      type: 'input',
      name: 'appName',
      message: '请输入应用名称(网站名)',
    }, {
      type: 'input',
      name: 'appCode',
      message: '请输入应用代号(appCode)',
      validate: function (val) {
        if (val.match(/^[a-zA-Z][a-zA-Z0-9_]*$/)) { // 校验位数
          return true;
        }
        return "AppCode不合法，应该是以英文开头的数字字母组合";
      }
    }
  ]
  return inquirer.prompt(question).then((answer) => {
    return confirmAppInfo(answer);
  }).catch(() => {
    return setAppInfo();
  });
}

function confirmAppInfo(appInfo) {
  console.log('网站名:', chalk.red(appInfo.appName));
  console.log('应用代码:', chalk.red(appInfo.appCode));
  const question = [
    {
      type: 'confirm',
      name: 'confirm',
      message: '以上信息是否正确',
    },
  ]
  return inquirer.prompt(question).then((answer) => {
    if (answer.confirm === false) {
      return Promise.reject();
    } else {
      return Promise.resolve(appInfo);
    }
  });
}



function setAppInfoFile(appInfo, file) {
  const spinner = ora('设置App信息').start();
  const replacePairs = [
    ['export const APPCODE =', `export const APPCODE = \'${appInfo.appCode}\';`],
    ['export const APPNAME =', `export const APPNAME = \'${appInfo.appName}\';`]
  ];
  let content = '';
  const rs = fs.createReadStream(file);

  const rl = readline.createInterface({
    input: rs,
  });
  rl.on('line', (line) => {
    content = content + replaceLine(line, replacePairs) + '\n';
  })
  rl.on('close', () => {
    fs.writeFile(file, content, 'utf8');
    spinner.succeed('App信息设置完成');
    console.info('模板已经创建，如果要设置App信息，请修改', chalk.blue('src/constants/appInfo.tsx'));
    console.link
  });
}

function replaceLine(line, linePairs) {
  srcLine = line.replace(/[\s]+/, ' ').trim();
  for (let pair of linePairs) {
    const first = pair[0].replace(/[\s]+/, ' ').trim();
    const second = pair[1].replace(/[\s]+/, ' ').trim();
    if (srcLine.startsWith(first)) {
      return second;
    }
  }
  return line;
}

function startCreate(appInfo) {
  console.log(chalk.blue('正在创建项目模板....'));
  console.log(appInfo);

  const dstDir = path.resolve(process.cwd());

  return repoTools.downloadRepo(appInfo.repo, dstDir)
    .then((tplPath) => {
      if (tplPath) {
        setAppInfoFile(appInfo, path.resolve(dstDir, 'src/constants/appInfo.tsx'));
        //repoTools.updateFolder(tplPath, path.resolve(process.cwd()))
      }
    })
}

const createApp = () => {
  console.log(figlet.textSync('GDJ', { font: 'ANSI Shadow' }))
  choiceClientTpl().then((repo) => {
    setAppInfo().then((appInfo) => {
      appInfo.repo = repo;
      return startCreate(appInfo);
    })
  });
}

const updateApp = () => {
  // 新建目录并克隆
  const dir = uf(process.cwd(), '.');
  fs.mkdirSync(dir);
  return choiceClientTpl().then((repo) => {
    return repoTools.downloadRepo(repo, dir)
      .then((tplPath) => {
        if (tplPath) {
          // 删除constants目录
          fs.removeSync(path.resolve(dir, 'src/constants'));
          fs.removeSync(path.resolve(dir, 'src/pages'));
          fs.removeSync(path.resolve(dir, 'mock'));
          fs.removeSync(path.resolve(dir, 'vendor'));
          fs.removeSync(path.resolve(dir, 'src/service/types.d.tsx'));

          // 读取packagejson: src, current
          const curPkg = require(path.resolve('./package.json'));
          const srcPkg = require(path.resolve(dir, 'package.json'));
          srcPkg.name = curPkg.name;
          srcPkg.version = curPkg.version;
          // 合并current 到 src
          const newPkg = merge(curPkg, srcPkg);
          // 拷贝并覆盖当前目录
          fs.copySync(dir, process.cwd());
          fs.removeSync(dir);
        }
      })
  });

}

module.exports = {
  updateApp,
  createApp,
}
