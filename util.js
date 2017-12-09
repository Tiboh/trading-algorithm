function Util(){
    this.getTransactionFeeUSD = function(amountUSD){
        if(amountUSD <= 10){
            return 0.99;
        }else if(amountUSD > 11 && amountUSD <= 25){
            return 1.49;
        }else if(amountUSD > 25 && amountUSD <= 50){
            return 1.99;
        }else if(amountUSD > 51 && amountUSD <= 201){
            return 2.99;
        }
        return amountUSD*1.49/100;   
    }

    this.getRSI = function(rsiPeriod, data, currentIndex){
        if(currentIndex < rsiPeriod){
            console.log("Not enough data to use RSI "+ rsiPeriod + "-period");
            rsiPeriod = currentIndex;            
            console.log(". RSI period is now " + rsiPeriod);            
        }

        var sumGain = 0;
        var sumLoss = 0;

        for(i = currentIndex-rsiPeriod ; i < rsiPeriod ; i++){
            var change = data[i+1] - data[i];
            if(change < 0){
                sumLoss += change;
            }else{
                sumGain += change;
            }
        }

        var averageGain = (sumGain/rsiPeriod).toFixed(6);
        var averageLoss = (sumLoss/rsiPeriod).toFixed(6);
        var firstRS = (averageGain/averageLoss).toFixed(6);
        var RSI = 100 - (100/(1+firstRS));
        
        return RSI;
    }
}

module.exports = Util;