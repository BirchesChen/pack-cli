var async = require('async');
var SSH2Utils = require('ssh2-utils');
var fs = require('fs');
var ssh = new SSH2Utils();
var privateKey = '../xxx.pem';

/*
exec linux shell on remote-servers
----------------------------------------------------------------------------------------------
 */
exports.cmdShell2 = function(cmd, ips, callback) {
    if(!cmd || !ips || !ips.length) {
        console.log('cmdShell2 ERR - 缺少参数')
    }
    else {
        var results = [];
        async.waterfall([
            function(cb1) {
                var servers = [];
                for(var i = 0; i < ips.length; i++) {
                    var _server = {};
                    _server['host'] = ips[i];
                    _server['username'] = 'root';
                    _server['privateKey'] = fs.readFileSync(privateKey);
                    servers.push(_server)
                }
                cb1(null, servers)
            },
            function(servers, cb1) {
                async.each(servers, function(server, cb2) {
                    var _result = {};
                    ssh.exec(server, cmd, function(err, stdout, stderr, server, conn) {
                        if (err) throw err;
                        _result['ip'] = server.host;
                        _result['cmdResult'] = stdout.replace('\n\n', '').replace('\n', '');
                        results.push(_result);
                        conn.end()
                        cb2()
                    })
                }, function(err) {
                    cb1(err, results)
                })
            }
        ], function(err, result) {
            if (err) throw err;
            callback(result)
        })
    }
}

/*
put file to remote-servers function
----------------------------------------------------------------------------------------------
 */
exports.putFiles = function(ips, filename, localPath, remotePath, callback) {
    if (!ips || !filename || !remotePath || !localPath) {
        console.log('putFiles ERR - 缺少参数')
    }
    else {
        async.waterfall([
            function(cb1) {
                var servers = [];
                for(var i = 0; i < ips.length; i++) {
                    var _server = {};
                    _server['host'] = ips[i];
                    _server['username'] = 'root';
                    _server['privateKey'] = fs.readFileSync(privateKey);
                    servers.push(_server)
                }
                cb1(null, servers)
            },
            function(servers, cb1) {
                async.each(servers, function(server, cb2) {
                    var _localFile = localPath + filename;
                    var _remoteFile = remotePath + filename;
                    ssh.putFile(server, _localFile, _remoteFile, function(err, server, conn) {
                        if (err) {
                            console.log(err)
                        }
                        conn.end();
                        cb2()
                    })
                }, function(err) {
                    cb1()
                })
            }
        ], function(err, result) {
            if (err) throw err;
            callback('put file success!!!')
        })
    }
}
