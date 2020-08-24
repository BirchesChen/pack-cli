const program = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')
const shell = require('shelljs')
const node_ssh = require('node-ssh')
const ssh = new node_ssh()


ssh.connect({
    host: '106.14.125.46',
    username: 'baofoofnt',
    port: 22,
    password:'brOG&&dL#PN4',
    tryKeyboard: true,
    function(name, instructions, instructionsLang, prompts, finish) {
        if (prompts.length > 0 && prompts[0].prompt.toLowerCase().includes('password'))
        {
            finish([password])
        }
    }
})
    .then(function() {
        console.log('come in')
        ssh.putFile('G:/ch/pack-cli/src/modulePro', '/home/faofoofnt/app/nginx/www/').then(function() {
            console.log("The File thing is done")
        }, function(error) {
            console.log("Something's wrong")
            console.log(error)
        })
    })


/*shell.exec('git clone https://github.com/BirchesChen/project')
shell.rm('-rf', '/modulePro/project');//删除
shell.cp('-R', 'project/', './modulePro');//复制
shell.rm('-rf', './project');//删除
shell.cd('./modulePro/project')
shell.echo('here');
shell.exec('npm install');
shell.exec('npm run build');*/
//shell.cd('..');//切到上级
