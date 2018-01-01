// Algorithm based on Relative Strength Index
// Buy crypto when RSI was under 30 and back above 30
// Sell crypto when RSI was over 70 and back below 70

const Util = require('./util.js');
var util = new Util();

function SimpleAlgo(account, RSIPeriod=14, RSILowValue=30, RSIHighValue=70){
    this.account = account;
    this.name = "Simple";
    this.lastPrices = [];
    this.IsHigherThanRSIHighValue = false;
    this.IsLowerThanRSILowValue = false;

    this.update = function(currentExchangeRateUSD){
        this.lastPrices.push(currentExchangeRateUSD);
        if(this.lastPrices.length > RSIPeriod){ // if there is enough data to compute RSI
            this.lastPrices.shift(); // remove first element to keep lastPrices-array the same length than RSI period
            var RSI = util.getRSI(this.lastPrices);
            if(RSI < RSILowValue){
                this.IsLowerThanRSILowValue = true;
            }else if(RSI > RSIHighValue){
                this.IsHigherThanRSIHighValue = true;
            }else{
                if(RSI >= RSILowValue){ 
                    if(this.IsLowerThanRSILowValue) { // if RSI was under RSILowValue but not anymore, then price is raising, so it's times to buy
                        this.account.buy(this.account.fundsUSD/2, currentExchangeRateUSD);
                    }
                    this.IsLowerThanRSILowValue = false; // reset value
                }
                if(RSI <= RSIHighValue){ // if RSI was over RSIHighValue but not anymore, then price is decreasing, so it's times to sell
                    if(this.IsHigherThanRSIHighValue){
                        this.account.sell(this.account.fundsCrypto*currentExchangeRateUSD/2, currentExchangeRateUSD);
                    }
                    this.IsHigherThanRSIHighValue = false;
                }
            }
        }
    }
}

module.exports = SimpleAlgo;