const Util = require('./util.js');

var util = new Util();

function Account(fundsUSD){
    this.fundsUSD = fundsUSD;
    this.fundsCrypto = 0;

    this.buy = function(amountUSD, exchangeRateUSD){
        if((this.fundsUSD - amountUSD) < 0){
            //throw new Error('NotEnoughUSDFundsException');
            //console.error("NotEnoughUSDFundsException");
        }else{
            this.fundsUSD -= amountUSD;
            this.fundsCrypto += (amountUSD/exchangeRateUSD)-(util.getTransactionFeeUSD(amountUSD)/exchangeRateUSD);
        }
    }

    this.sell = function(amountUSD, exchangeRateUSD){
        if((this.fundsCrypto - amountUSD/exchangeRateUSD) < 0){
            //throw new Error('NotEnoughCryptoFundsException');            
            //console.error("NotEnoughCryptoFundsException");            
        }else{
            this.fundsUSD += amountUSD-util.getTransactionFeeUSD(amountUSD);
            this.fundsCrypto -= amountUSD/exchangeRateUSD;
        }
    }

    this.balanceUSD = function(exchangeRateUSD){
        return (this.fundsCrypto*exchangeRateUSD) + this.fundsUSD;
    }
}

module.exports = Account;