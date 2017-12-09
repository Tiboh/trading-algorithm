function RandomAlgo(account){
    const TRANSACTION_VALUE = 1000;
    this.account = account;
    this.update = function(currentExchangeRateUSD){
        if(Math.random() < 0.5){
            this.account.buy(TRANSACTION_VALUE,currentExchangeRateUSD);
        }else{
            this.account.sell(TRANSACTION_VALUE,currentExchangeRateUSD);
        }
    }
}

module.exports = RandomAlgo;