'use strict';

let express = require('express');
let app = express();
const http = require('http');

var proxy = httpProxy.createProxyServer({ target: 'ws://178.128.230.11:8080/', ws: true });

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
