const crypto = require('crypto');
const axios = require('axios');
const apiCredentials = require('./api_credentials');

const timestamp = Date.now() / 1000;
const apiOptions = {
  key: apiCredentials.key,
  secret: apiCredentials.secret,
  passphrase: apiCredentials.passphrase,
  method: 'GET',
  requestPath: '/accounts',
  url: 'https://api.pro.coinbase.com'
}

async function sendRequest(){
  const request_options = {
    method: 'GET',
    url: apiOptions.url + apiOptions.requestPath,
    headers: {
      'CB-ACCESS-KEY': apiOptions.key,
      'CB-ACCESS-SIGN': getSignature(),
      'CB-ACCESS-TIMESTAMP': timestamp,
      'CB-ACCESS-PASSPHRASE': apiOptions.passphrase,
    }
  }
  let res = ""
  try {
    res = await axios.request(request_options);
  } catch(error) {
    console.error(`Request Error: ${error.response.data.message}`);
  }
  return res.data
}

/* PRIVATE */
//
//
function getSignature(){
  // create the prehash string by concatenating required parts
  var prehashString = timestamp + apiOptions.method + apiOptions.requestPath;

  // decode the base64 secret
  var key = Buffer.from(apiOptions.secret, 'base64');

  // create a sha256 hmac with the secret
  var hmac = crypto.createHmac('sha256', key);

  // sign the require message with the hmac
  // and finally base64 encode the result
  return hmac.update(prehashString).digest('base64');
}

async function test(){
  const res = await sendRequest();
  console.log(res);
}

test();
