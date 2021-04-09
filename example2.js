const portfolioGetter = require('./portfolio_getter')

async function test(){
  const res = await portfolioGetter.getPortfolio();
  console.log(res);
}

test();
