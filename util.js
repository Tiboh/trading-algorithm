var fs = require('fs');
var csvWriter = require('csv-write-stream')

function Util(){
    this.writeFile = function(filename, RSIPeriodValue, RSILowValue, RSIHighValue, balanceUSDValue){      
        // var writer = csvWriter()
        // writer.pipe(fs.createWriteStream(filename, {flags: 'a'}))
        // writer.write({RSIPeriod: RSIPeriodValue, RSILow:RSILowValue, RSIHigh:RSIHighValue, balanceUSD:balanceUSDValue})
        // writer.end()

        if (!fs.existsSync(filename))
            writer = csvWriter({ headers: ["RSIPeriod", "RSILow", "RSIHigh","BalanceUSD"]});
        else
            writer = csvWriter({sendHeaders: false});
        
        writer.pipe(fs.createWriteStream(filename, {flags: 'a'}));
        writer.write({RSIPeriod: RSIPeriodValue, RSILow:RSILowValue, RSIHigh:RSIHighValue, BalanceUSD:balanceUSDValue})        
        writer.end();
    }

    this.getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

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

    this.getRSI = function(data){
        if(data.length < 2){
            //throw new Error("RSI period can't be less than 2");
            console.log("RSI period can't be less than 2");
        }else{
            var sumGain = 0;
            var sumLoss = 0;
            var averageGain = 0;
            var averageLoss = 0;
            var firstRS = 0;

            for(j = 0 ; j < data.length-1 ; j++){
                var change = data[j+1] - data[j];
                if(change < 0){
                    sumLoss += Math.abs(change);
                }else{
                    sumGain += change;
                }
            }

            averageGain = (sumGain/data.length);
            averageLoss = (sumLoss/data.length);

            if(averageLoss == 0){
                firstRS = 100;
            }else{
                firstRS = (averageGain/averageLoss);
            }
            
            var RSI = 100 - (100/(1+firstRS));
            
            return RSI;
        }
    }
}

module.exports = Util;