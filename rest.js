const https = require('https');

let options = {
  method: 'GET',
  hostname: 'api.pro.coinbase.com',
  path: '/products',
  port: 443,
}

const req = https.request(options, res => {
  // console.log(`statusCode: ${res.statusCode}`)

  let response = ""
  res.on('data', d => {
    response += d.toString()
  })
  res.on('end', () => {
    console.log(response)
  })
})

req.on('error', error => {
  console.error(error)
})

req.end()
