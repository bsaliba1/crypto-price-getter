const crypto = require('crypto');
const axios = require('axios');
const defaultApiCredentials = require('./default_api_credentials');
const { PriceGetter } = require('./price_getter')

const requestOptions = {
  method: 'GET',
  url: 'https://api.pro.coinbase.com'
}

async function getPortfolioBalance(key = defaultApiCredentials.key, secret = defaultApiCredentials.secret, passphrase = defaultApiCredentials.passphrase){
  const assetAccounts = await getAssetAccounts(key, secret, passphrase);
  const sumBalance = await sumAssetBalances(assetAccounts);
  return sumBalance
}

async function getAssetAccounts(key = defaultApiCredentials.key, secret = defaultApiCredentials.secret, passphrase = defaultApiCredentials.passphrase){
  let options = {...requestOptions}
  options.requestPath = '/accounts'
  options.key = key;
  options.secret = secret;
  options.passphrase = passphrase;
  const response = await sendRequest(options);
  return response
}

/* PRIVATE */
//
//
// Sends a formatted request to coinbase using the given API key, secret, and passphrase
async function sendRequest(options){
  const request = formatRequest(options);
  let response = ""
  try {
    response = await axios.request(request);
  } catch(error) {
    console.error(`Request Error: ${error.response.data.message}`);
    return
  }
  return response.data
}

// Sends a formatted request using the given API key, secret, and passphrase
function formatRequest(options){
  const method = 'GET';
  const url = options.url + options.requestPath;
  const timestamp = Date.now() / 1000;
  const headers = {
    'CB-ACCESS-KEY': options.key,
    'CB-ACCESS-SIGN': getSignature(options, timestamp),
    'CB-ACCESS-TIMESTAMP': timestamp,
    'CB-ACCESS-PASSPHRASE': options.passphrase,
  }
  const formattedRequest = {
    method: method,
    url: url,
    headers: headers
  }
  return formattedRequest
}

// Creates a API signature using the given API key, secret, passphrase, and timestamp
function getSignature(options, timestamp){
  // create the prehash string by concatenating required parts
  let prehashString = timestamp + options.method + options.requestPath;

  // decode the base64 secret
  const key = Buffer.from(options.secret, 'base64');

  // create a sha256 hmac with the secret
  let hmac = crypto.createHmac('sha256', key);

  // sign the require message with the hmac
  // and finally base64 encode the result
  return hmac.update(prehashString).digest('base64');
}

async function sumAssetBalances(assetAccounts){
  let sum = 0;
  for (index in assetAccounts) {
    const assetAccount = assetAccounts[index];
    const assetBalance = parseFloat(assetAccount.balance);
    const assetName = assetAccount.currency;
    if (assetBalance == 0) {
      continue;
    }
    if (assetName == 'USD' || assetName == 'USDC'){
      sum = sum + assetBalance
      continue;
    }
    try {
      const assetPrice = await PriceGetter.getLatestTradePrice(assetAccount.currency, 'USD')
      const dollarBalance = assetPrice * assetBalance;
      sum = sum + dollarBalance;
    } catch(error){
      try {
        const assetPrice = await PriceGetter.getLatestTradePrice(assetAccount.currency, 'USDC')
        const dollarBalance = assetPrice * assetBalance;
        sum = sum + dollarBalance
      } catch {};
    }
  }
  return Math.round(sum * 100) / 100
}

exports.getAssetAccounts = getAssetAccounts;
exports.getPortfolioBalance = getPortfolioBalance;
