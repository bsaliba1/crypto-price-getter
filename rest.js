const https = require('https');

let API_SERVER = {
  method: 'GET',
  hostname: 'api.pro.coinbase.com',
  path: '/products/BTC-USD/stats',
  port: 443
}

class PriceGetter {
  static get24hrPrice(asset, base){

  }

  static getLatestPrice(asset, base){

  }

  static compare24hrPrice(asset, base){

  }

  // Private

  // Sends HTTP request to the Coinbase REST API
  // Return value is the requested information in JSON form
  // If there is an error the return value is 'undefined'
  static sendRequest(options){
    const request_options = this.formatRequest(options)
    const request = https.request(API_SERVER, response => {
      if (this.invalidStatusCode(response)){
        console.log(`Status code: ${response.statusCode} \nCould not retrieve data`)
        return undefined
      }

      let data = ""
      response.on('data', dataChunk => {
          data += dataChunk.toString()
      })
      response.on('end', () => {
        console.log(data)
      })
    })

    request.on('error', error => {
      console.error(error)
      return undefined
    })

    request.end()
  }

  static formatRequest(options) {
    // TODO
  }

  static invalidStatusCode(response){
    const statusCode = parseInt(response.statusCode)
    if (!(200 <=  statusCode && statusCode <= 299)) {
      return true
    }
    return false
  }
}

PriceGetter.sendRequest()
