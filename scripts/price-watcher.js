const Coingecko = require('coingecko-api');
const Oracle = artifacts.require('Oracle.sol');

const PULL_INTERVAL = 5000;
const CoinGeckoClient = new Coingecko();

module.exports = async done => {
    const [_, reporter] = await web3.eth.getAccounts();
    const oracle = await Oracle.deployed();

    while(true) {
        const response = await CoinGeckoClient.coins.fetch("bitcoin", {});
        let currentPrice = parseFloat(response.data.market_data.current_price.usd);
        currentPrice = parseInt(currentPrice * 100);
        await oracle.updateData(
            web3.utils.soliditySha3('BTC/USD'),
            currentPrice,
            {from: reporter}
        );
        console.log(`Current price for BTC/USD ${currentPrice} updated on-chain`);
        await new Promise(resolve => setTimeout(resolve, PULL_INTERVAL));
    }
    done();
}