var http = require('http');
var url = require('url');

var server = http.createServer(function(req,res){
	var requestUrl = req.url;

  console.log('requestUrl', requestUrl);

  res.setHeader("Access-Control-Allow-Origin", "*"); // replace * sign of your ip:appPort 192.168.1.176
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.setHeader("X-Powered-By", "3.2.1");
  res.setHeader("Content-Type", "application/json;charset=utf-8");

  var chunks = [];
  var len = 0;

  console.log('=========================== Request starts:' + (new Date().getTime()) + '=====================================\n');

  var param = {
      host:'testapi.jihes.com',
      port: 80,
      path: requestUrl,
      method: req.method,      
      headers:{
        'Content-Type': 'application/json',
        'Connection': 'keep-alive'
      }
  };
  
  console.log('Request params:\n');
  console.log(param);

  var sreq = http.request(param, function(sres) {
      sres.setEncoding('utf8');

      sres.on('data', function(chunk) {
          chunks.push(new Buffer(chunk));
      })

      sres.on('end', function() {
          var resData = Buffer.concat(chunks);
          var jsonString = resData.toString();
          console.log('=========================== Response receieves:' + (new Date().getTime()) + '=====================================\n');
          console.log(jsonString);
          console.log('=====================================     end     ===============================================\n\n');
          
          res.write(jsonString);
          res.end();
      });
  });

  sreq.on('error', function(e) {
      console.log(e.message);
      sreq.end();
  });

  if (/POST|PUT/i.test(req.method)) {
      req.pipe(sreq);
  } else {
      sreq.end();
  }

});

server.listen(3000);
