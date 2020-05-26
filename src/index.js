const shell = require('shelljs')


shell.exec('git clone https://github.com/BirchesChen/project')
shell.rm('-rf', '/modulePro/project');//删除
shell.cp('-R', 'project/', './modulePro');//复制
shell.rm('-rf', './project');//删除
shell.cd('./modulePro/project')
shell.exec('npm install')
shell.exec('npm run build')
//shell.cd('..');//切到上级
