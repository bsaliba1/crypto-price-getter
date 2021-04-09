const portfolioGetter = require('./portfolio_getter')

async function test(){
  const assets = await portfolioGetter.getAssetAccounts();
  const balance = await portfolioGetter.getPortfolioBalance();
  console.log(assets);
  console.log(balance);
}

test();
