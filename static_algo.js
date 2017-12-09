function StaticAlgo(account){
    this.account = account;
    this.alreadyBought = false;
    this.update = function(currentExchangeRateUSD){
        if(!this.alreadyBought){
            this.account.buy(this.account.fundsUSD,currentExchangeRateUSD);
            this.alreadyBought = true;
        }
    }
}

module.exports = StaticAlgo;