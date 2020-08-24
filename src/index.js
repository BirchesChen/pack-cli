const path = require('path');
const archiver =require('archiver');
const fs = require('fs');
const node_ssh = require('node-ssh');
const ssh = new node_ssh();
const srcPath = path.resolve(__dirname,'./dist');
//const configs = require('./config');

console.log('开始压缩dist目录...');
startZip();

//压缩dist目录为public.zip
function startZip() {
    var archive = archiver('zip', {
        zlib: { level: 10 } //递归扫描最多5层
    }).on('error', function(err) {
        throw err;//压缩过程中如果有错误则抛出
    });

    var output = fs.createWriteStream(__dirname + '/public.zip')
        .on('close', function(err) {
            /*压缩结束时会触发close事件，然后才能开始上传，
              否则会上传一个内容不全且无法使用的zip包*/
            if (err) {
                console.log('关闭archiver异常:',err);
                return;
            }
            console.log('已生成zip包');
            console.log('开始上传public.zip至远程机器...');
            uploadFile();
        });

    archive.pipe(output);//典型的node流用法
    archive.directory(srcPath,'/public');//将srcPach路径对应的内容添加到zip包中/public路径
    archive.finalize();
}

//将dist目录上传至正式环境
function uploadFile() {
    ssh.connect({ //configs存放的是连接远程机器的信息
        host: '192.168.124.130',
        username: 'root',
        password: '909296',
        port:22 //SSH连接默认在22端口
    }).then(function () {
        //上传网站的发布包至configs中配置的远程服务器的指定地址
        ssh.putFile(__dirname + '/public.zip', configs.path).then(function(status) {
            console.log('上传文件成功');
            console.log('开始执行远端脚本');
            //startRemoteShell();//上传成功后触发远端脚本
        }).catch(err=>{
            console.log('文件传输异常:',err);
            process.exit(0);
        });
    }).catch(err=>{
        console.log('ssh连接失败:',err);
        process.exit(0);
    });
}

//执行远端部署脚本
function startRemoteShell() {
    //在服务器上cwd配置的路径下执行sh deploy.sh脚本来实现发布
    ssh.execCommand('sh deploy.sh', { cwd:'/usr/bin/XXXXX' }).then(function(result) {
        console.log('远程STDOUT输出: ' + result.stdout)
        console.log('远程STDERR输出: ' + result.stderr)
        if (!result.stderr){
            console.log('发布成功!');
            process.exit(0);
        }
    });
}

/*const program = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')
const shell = require('shelljs')
const node_ssh = require('node-ssh')
const ssh = new node_ssh()


/!*ssh.connect({
    host: '192.168.124.130',
    username: 'root',
    port: 22,
    password:'909296',
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
        ssh.putFile('G:/ch/pack-cli/src/modulePro', '/root').then(function() {
            console.log("The File thing is done")
        }, function(error) {
            console.log("Something's wrong")
            console.log(error)
        })
    })*!/

const arrNew = [2, 1, 5, 3, 6, 4, 8, 9, 7]
getSequence(arrNew)

function getSequence (arr) {
    const p = arr.slice()
    const result = [0]
    let i, j, u, v, c
    const len = arr.length
    console.log('length', len)
    for (i = 0; i < len; i++) {
        const arrI = arr[i]
        if (arrI !== 0) {
            j = result[result.length - 1]
            if (arr[j] < arrI) {
                // 存储在 result 更新前的最后一个索引的值
                p[i] = j
                result.push(i)
                console.log('result', result)
                continue
            }
            u = 0
            v = result.length - 1
            // 二分搜索，查找比 arrI 小的节点，更新 result 的值
            while (u < v) {
                c = ((u + v) / 2) | 0
                if (arr[result[c]] < arrI) {
                    u = c + 1
                }
                else {
                    v = c
                }
            }
            if (arrI < arr[result[u]]) {
                if (u > 0) {
                    p[i] = result[u - 1]
                }
                result[u] = i
            }
        }
    }
    u = result.length
    v = result[u - 1]

    // 回溯数组 p，找到最终的索引
    while (u-- > 0) {
        result[u] = v
        v = p[v]
    }
    console.log('result', result)
    return result
}*/


/*shell.exec('git clone https://github.com/BirchesChen/project')
shell.rm('-rf', '/modulePro/project');//删除
shell.cp('-R', 'project/', './modulePro');//复制
shell.rm('-rf', './project');//删除
shell.cd('./modulePro/project')
shell.echo('here');
shell.exec('npm install');
shell.exec('npm run build');*/
//shell.cd('..');//切到上级
