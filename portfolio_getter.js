const crypto = require('crypto');
const axios = require('axios');
const apiCredentials = require('./default_api_credentials');

const requestOptions = {
  method: 'GET',
  requestPath: '/accounts',
  url: 'https://api.pro.coinbase.com'
}

async function getPortfolio(key = apiCredentials.key, secret = apiCredentials.secret, passphrase = apiCredentials.passphrase){
  requestOptions.key = key;
  requestOptions.secret = secret;
  requestOptions.passphrase = passphrase;
  const res = await sendRequest();
  return res
}

/* PRIVATE */
//
//
// Sends a formatted request to coinbase using the given API key, secret, and passphrase
async function sendRequest(){
  const request = formatRequest();
  let res = ""
  try {
    res = await axios.request(request);
  } catch(error) {
    console.error(`Request Error: ${error.response.data.message}`);
    return
  }
  return res.data
}

// Sends a formatted request using the given API key, secret, and passphrase
function formatRequest(){
  const method = 'GET';
  const url = requestOptions.url + requestOptions.requestPath;
  const timestamp = Date.now() / 1000;
  const headers = {
    'CB-ACCESS-KEY': requestOptions.key,
    'CB-ACCESS-SIGN': getSignature(timestamp),
    'CB-ACCESS-TIMESTAMP': timestamp,
    'CB-ACCESS-PASSPHRASE': requestOptions.passphrase,
  }
  const formattedRequest = {
    method: method,
    url: url,
    headers: headers
  }
  return formattedRequest
}

// Creates a API signature using the given API key, secret, passphrase, and timestamp
function getSignature(timestamp){
  // create the prehash string by concatenating required parts
  let prehashString = timestamp + requestOptions.method + requestOptions.requestPath;

  // decode the base64 secret
  const key = Buffer.from(requestOptions.secret, 'base64');

  // create a sha256 hmac with the secret
  let hmac = crypto.createHmac('sha256', key);

  // sign the require message with the hmac
  // and finally base64 encode the result
  return hmac.update(prehashString).digest('base64');
}

exports.getPortfolio = getPortfolio;
