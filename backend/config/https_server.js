var https = require('https');

var fs = require('fs');

var options = {

  key: fs.readFileSync("/home/ubuntu/certs/cnox.io.key"),

  cert: fs.readFileSync("/home/ubuntu/certs/www_cnox_io.crt"),

  ca: [

          fs.readFileSync('/home/ubuntu/certs/AddTrustExternalCARoot.crt'),

          fs.readFileSync('/home/ubuntu/certs/SectigoRSADomainValidationSecureServerCA.crt')

       ]
};
 

https.createServer(options, function (req, res) {

 res.writeHead(200);

 res.end("Welcome to Node.js HTTPS Servern");

}).listen(8443)
