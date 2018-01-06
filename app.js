const Data = require('./data.js');
const RandomAlgo = require('./random_algo.js');
const SimpleAlgo = require('./simple_algo.js');
const StaticAlgo = require('./static_algo.js');
const Account = require('./account.js');
const PlotData = require('./plotData.js');
const RSIData = require('./RSIData.js');

function RunAlgo(algo, account, exchangeRateUSDHistory) {
    var plotData = new PlotData(exchangeRateUSDHistory, algo.name);
    var rsiData = new RSIData(plotData, RSIPeriod, RSIHighValue, RSILowValue);

    for(i = 0 ; i < exchangeRateUSDHistory.length ; i++){
        algo.update(exchangeRateUSDHistory[i].Close);
        plotData.update(i, account);
        rsiData.update(i, account);
    }    
    plotData.prepareData();
    rsiData.prepareData();
    plotData.plotData();
}

var data = new Data('csv/BTC_hour.csv');    
var RSILowValue;
var RSIHighValue;
var RSIPeriod;
var account;
var filename = "C:/Temp/result.csv";
var balanceUSD = 0;
for(k=0 ; k < 1 ; k++){
    account = new Account(10000);
    RSILowValue = 30;
    RSIHighValue = 70;
    RSIPeriod = 14;
    var exchangeRateUSDHistory = data.history;    
    RunAlgo(new SimpleAlgo(account, RSIPeriod, RSILowValue, RSIHighValue), account, exchangeRateUSDHistory);
    balanceUSD = account.balanceUSD(exchangeRateUSDHistory[exchangeRateUSDHistory.length-1].Close);
    var result = RSIPeriod+","+RSILowValue+","+RSIHighValue+","+balanceUSD;
    console.log(result);
}
