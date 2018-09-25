'use strict';

let express = require('express');
let app = express();
const http = require('http');
const httpProxy = require('http-proxy');
const bodyParser = require('body-parser');

var proxy = httpProxy.createProxyServer({ target: 'ws://178.128.230.11:8080/', ws: true });
app.use(bodyParser());
// All of our paths have the Link header.
app.use(function (req, res, next) {
  res.status(200).links({
    'payment-method-manifest':
      'https://carte7000-payment-demo.herokuapp.com/pay/payment-manifest.json',
  });
  return next();
});
// We are mostly a static website.
app.use(express.static('public'));

app.get('/keyFactory/:id/:ticker', (req, res) => {
  http.get(`http://142.93.60.68:5080/api/v1/getaddress/${req.params.id}/${req.params.ticker}`, (response) => {
    response.pipe(res);
  })
})

app.post('/ledger/tx', (req, res) => {
  var post_data = JSON.stringify(req.body);
  var post_options = {
    host: '138.197.156.204',
    port: '8081',
    path: '/tx',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(post_data)
    }
  };
  // Set up the request
  var post_req = http.request(post_options, function (response) {
    response.pipe(res);
  });

  // post the data
  post_req.write(post_data);
  post_req.end();
})

app.post('/ledger/create', (req, res) => {
  var post_data = JSON.stringify(req.body);
  var post_options = {
    host: '138.197.156.204',
    port: '8081',
    path: '/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(post_data)
    }
  };
  // Set up the request
  var post_req = http.request(post_options, function (response) {
    response.pipe(res);
  });

  // post the data
  post_req.write(post_data);
  post_req.end();
  // http.post('http://138.197.156.204:8081/create', req.body, (response) => {
  //   response.pipe(res);
  // })
})
/**
 * Starts the server.
 */
if (module === require.main) {
  let server = app.listen(process.env.PORT || 8080, function () {
    console.log('App listening on port %s', server.address().port);
  });
  server.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
  });
}

module.exports = app;
