var PORT = 3000;

var http = require('http');
var url=require('url');
var fs=require('fs');
var mine=require('./mine').types;
var path=require('path');
var httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({
    // 下面的设置用于https
    // ssl: {
    //     key: fs.readFileSync('server_decrypt.key', 'utf8'),
    //     cert: fs.readFileSync('server.crt', 'utf8')
    // },
    // secure: false
});

proxy.on('error', function(err, req, res){
    res.writeHead(500, {
        'content-type': 'text/plain'
    });
    res.end('Something went wrong. And we are reporting a custom error message.');
});

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var realPath = path.join("./", pathname);

    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';

    // 判断如果是接口访问，则通过proxy转发
    if(realPath.indexOf("\\") > 0){

        request.headers.host = 'testapi.jihes.com';
        request.headers.referrer = 'testapi.jihes.com';
        proxy.web(request, response, {target: 'http://testapi.jihes.com'});
        return;
    }

    // 这里貌似是如果不是接口访问，是本地的文件请求就直接进行本地响应
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end('error', err);
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
    
});

server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");
