const Data = require('./data.js');

ALGORITHMS = {
    'simple': Simple,
    'pirate': Pirate,
    'random': Random,
    'static': Static,
}

function getTransactionFeeUSD(amoutUSD){
    if(amoutUSD <= 10){
        return 0.99;
    }else if(amountUSD > 11 & amoutUSD <= 25){
        return 1.49;
    }else if(amountUSD > 25 & amoutUSD <= 50){
        return 1.99;
    }else if(amountUSD > 51 & amoutUSD <= 201){
        return 2.99;
    }
    return amountUSD*1.49/100;   
}

function Account(fundsUSD){
    this.fundsUSD = fundsUSD;
    this.fundsCrypto = 0;

    this.buy = function(amountUSD, exchangeRateUSD){
        this.fundsUSD -= amountUSD;
        this.fundsCrypto += (amountUSD/exchangeRateUSD)-(getTransactionFeeUSD(amoutUSD)/exchangeRateUSD);
    }
    this.sell = function(amountUSD, exchangeRateUSD){
        this.fundsUSD += amountUSD-getTransactionFeeUSD(amountUSD);
        this.fundsCrypto -= amountUSD/exchangeRateUSD;
    }

    this.balanceUSD = function(exchangeRateUSD){
        return fundsCrypto*exchangeRateUSD;
    }
}

function RunAlgo(algorithmName, csvFile, startDate, endDate) {
    var data = new Data();
    var algo = ALGORITHMS.get(algorithmName);
    
    

    console.log(data.getBuyPrice('2017-01-17', '2017-02-19'));
}