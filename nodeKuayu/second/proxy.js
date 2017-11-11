var http = require('http');
var zlib = require('zlib');

var sendPromise = function(req, callback) {
    var options = {
        host: 'testapi.jihes.com',
        path: req.url,
        method: req.method,
        headers: req.headers            
      }
    };
    options.headers.host = options.host;  // 这句可以没有，就算设置了在请求头里的host也还是localhost:3000

    console.log('options : ', JSON.stringify(options, 2));

    var request = http.request(options, function(res) {
        var chunks = [],
            data, encoding = res.headers['content-encoding'];

        if (encoding === 'undefined') {
            res.setEncoding('utf-8');
        }

        res.on('data', function(chunk) {
            console.log('chunk', chunk);
            chunks.push(chunk);
        });

        res.on('end', function() {
            var buffer = Buffer.concat(chunks);
            if (encoding == 'gzip') {
                zlib.gunzip(buffer, function(err, decoded) {
                    data = decoded.toString();
                    callback(err, data);
                });
            } else if (encoding == 'deflate') {
                zlib.inflate(buffer, function(err, decoded) {
                    data = decoded.toString();
                    callback(err, data);
                });
            } else {
                data = buffer.toString();
                callback(null, data);
            }

        });
    });


    request.on('error', function(e) {
        callback('path:' + options.path + ';' + e, null);
    });

    var body = req.body;
    if (body && options.method == 'POST') {
        var postBody = {};
        for (var k of Object.keys(body)) {
            postBody[k] = body[k];
        }
        request.write(postBody);
    }
    request.end();

}

var server = http.createServer(function(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*"); // replace * sign of your ip:appPort 
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.setHeader("X-Powered-By", "3.2.1");
    res.setHeader("Content-Type", "application/json;charset=utf-8");

    sendPromise(req, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.end(result);
    }) 

});

server.listen(3000);
