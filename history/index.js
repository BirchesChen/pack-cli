var clientServer = require('./clientServer');
var ip = [
    '127.0.0.1'//server ip
];
var filename = 'test.zip';
var localPaht = './a/b/';
var serverPath = '/home/a/b/';
var newDirName = 'www';

var timestr = dateFormat('yyyy-MM-dd_HH.mm.ss');
var cmd = [
    `mkdir ${serverPath}${newDirName}`,
    `mv ${serverPath}${filename} ${serverPath}${newDirName}/`,
    `unzip ${serverPath}${newDirName}/${filename} -d ${serverPath}${newDirName}/`,
    `rm -f ${serverPath}${newDirName}/${filename}`,
    `mv ${serverPath}${newDirName} ${serverPath}${newDirName}-${timestr}`,
    `mv ${serverPath}${newDirName} ${serverPath}${newDirName}`,
];

var cmdIndex = 0;

new Promise(function (success,error) {
    console.log('开始上传')
    clientServer.putFiles(ip,filename, localPaht, serverPath,function (msg) {
        console.log(msg);
        success()
    })
})
    .then(function () {
        loopCmd(0,true);
    })

function loopCmd(index,indeep) {
    if (index>=cmd.length) {console.log('全部执行完毕');return;}
    var c = cmd[index];
    console.log(c);
    clientServer.cmdShell2(c,ip,function (result) {
        console.log(result);
        if (indeep) {
            index++;
            loopCmd(index,indeep);
        }
    })
}
function dateFormat(formatString,date){
    var date = date||new Date();
    var o = {
        Y: date.getFullYear(),
        M: date.getMonth() + 1,
        D: date.getDate(),
        H: date.getHours(),
        m: date.getMinutes(),
        S: date.getSeconds()
    };
    for (var i in o) {
        if (o.hasOwnProperty(i)) {
            if (o[i] < 10) {
                o[i] = '0' + o[i];
            }
        }
    }
    var formatString = formatString || 'yyyy/MM/dd HH:mm:ss';
    var reg = new RegExp('[Yy]+|M+|[Dd]+|[Hh]+|m+|[Ss]+', 'g');
    var regM = new RegExp('m');
    var regY = new RegExp('y', 'i');
    return formatString.replace(reg, function(v) {
        var old = v;
        if (regM.test(v)) {
            old = o.m;
        } else if (regY.test(v)) {
            var y = '' + o.Y;
            var le = y.length - (v.length == 1 ? 2 : v.length);
            old = y.substring(y.length, le)
        } else {
            var key = v.toUpperCase().substr(0, 1);
            old = o[key];
        }
        return old;
    });
}
