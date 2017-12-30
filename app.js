const Data = require('./data.js');
const RandomAlgo = require('./random_algo.js');
const SimpleAlgo = require('./simple_algo.js');
const StaticAlgo = require('./static_algo.js');
const Util = require('./util.js');
const Account = require('./account.js');
const plotly = require('plotly')('Tiboh', 'bpXscfMKbSEhYRVbx0iS');

AlgoType = {
    STATIC : 'static',
    RANDOM : 'random',
    SIMPLE : 'simple'
}

function RunAlgo(algo, account, exchangeRateUSDHistory) {
    var util = new Util();

    var dateArray = [];
    var balanceUSDArray = [];
    var fundsUSDArray = [];
    var fundsCryptoArray = [];
    var cryptoValueArray = [];

    var RSILowArray = [];
    var RSILowDateArray = [];
    var RSIHighArray = [];
    var RSIHighDateArray = [];
    var RSIValueArray = [];
    var RSIValueDateArray = [];
    var RSILowerLineArray = [];
    var RSIHigherLineArray = [];

    for(i = 0 ; i < exchangeRateUSDHistory.length ; i++){
        algo.update(exchangeRateUSDHistory[i].Close);
        var currentDate = exchangeRateUSDHistory[i].Date;
        dateArray.push(currentDate);
        balanceUSDArray.push(account.balanceUSD(exchangeRateUSDHistory[i].Close));
        fundsUSDArray.push(account.fundsUSD);
        fundsCryptoArray.push(account.fundsCrypto);
        cryptoValueArray.push(exchangeRateUSDHistory[i].Close);

        if(i > RSIPeriod){
            var RSI = util.getRSI(exchangeRateUSDHistory.slice(i-RSIPeriod, i).map(a => a.Close), i);
            if(RSI < RSILowValue){
                RSILowArray.push(exchangeRateUSDHistory[i].Close);
                RSILowDateArray.push(currentDate);
            }else if(RSI > RSIHighValue){
                RSIHighArray.push(exchangeRateUSDHistory[i].Close);
                RSIHighDateArray.push(currentDate);
            }
            RSIValueArray.push(RSI);
            RSIValueDateArray.push(currentDate);
        }
        RSILowerLineArray.push(RSILowValue);
        RSIHigherLineArray.push(RSIHighValue);
    }    
    PlotData(algo.name, dateArray, balanceUSDArray, fundsUSDArray, fundsCryptoArray, cryptoValueArray, RSIPeriod, RSILowArray, RSILowDateArray, RSIHighArray, RSIHighDateArray, RSIValueArray, RSIValueDateArray, RSILowerLineArray, RSIHigherLineArray);
}

function PlotData(algorithmType, dateArray, balanceUSDArray, fundsUSDArray, fundsCryptoArray, cryptoValueArray, RSIPeriod, RSILowArray, RSILowDateArray, RSIHighArray, RSIHighDateArray, RSIValueArray, RSIValueDateArray, RSILowerLineArray, RSIHigherLineArray){
    var balanceUSDData =
    {
        x: dateArray,
        y: balanceUSDArray,
        type: "scatter",
        name: "Balance in $"
    };
    var fundsUSDData = 
        {
        x: dateArray,
        y: fundsUSDArray,
        type: "scatter",
        name: "Funds in $"
        };
    var fundsCryptoData =
        {
        x: dateArray,
        y: fundsCryptoArray,
        type: "scatter",
        name: "Funds in Ƀ",
        };
    var cryptoValueData =
        {
        x: dateArray,
        y: cryptoValueArray,
        type: "scatter",
        name: "Ƀ value in $"
        };
    var RSILowData =
        {
        x: RSILowDateArray,
        y: RSILowArray,
        mode: "markers",
        type: "scatter",
        name: "RSI-"+RSIPeriod+" below "+RSILowValue
        };
    var RSIHighData =
        {
        x: RSIHighDateArray,
        y: RSIHighArray,
        mode: "markers",
        type: "scatter",
        name: "RSI-"+RSIPeriod+" above "+RSIHighValue
        };
    var RSIValueData ={
        x: RSIValueDateArray,
        y: RSIValueArray,
        type: "scatter",
        name: "RSI-"+RSIPeriod+" value",
        yaxis: "y3",
        xaxis: "x"
        };
    var RSIHigherLineData ={
        x: dateArray,
        y: RSIHigherLineArray,
        type: "scatter",
        yaxis: "y3",
        xaxis: "x"
        };
    var RSILowerLineData ={
        x: dateArray,
        y: RSILowerLineArray,
        type: "scatter",
        yaxis: "y3",
        xaxis: "x"
        };
    var data = [balanceUSDData,fundsUSDData,fundsCryptoData,cryptoValueData, RSILowData, RSIHighData, RSIValueData, RSIHigherLineData, RSILowerLineData];
    //var data = [RSILowData, RSIHighData, RSIValueData];
    
    var layout = {
        title: algorithmType,
        yaxis: {
            title: "$",
            domain: [0, 0.65]
        },
        yaxis3: {
            title: "RSI",
            domain: [0.75, 1]
        }
    };
    var graphOptions = {layout: layout, filename: "date-axes", fileopt: "overwrite"};
    plotly.plot(data, graphOptions, function (err, msg) {
        console.log(msg);
        console.log(err);
    });
}

var data = new Data('csv/BTC_hour.csv');    
var RSILowValue;
var RSIHighValue;
var RSIPeriod;
var account;
var util = new Util();
var filename = "C:/Temp/result.csv";
var balanceUSD = 0;
for(k=0 ; k < 1 ; k++){
    account = new Account(10000);
    // RSILowValue = util.getRandomInt(2,50);
    // RSIHighValue = util.getRandomInt(50,98);
    // RSIPeriod = util.getRandomInt(2,100);
    RSILowValue = 30;
    RSIHighValue = 70;
    RSIPeriod = 14;
    var exchangeRateUSDHistory = data.history;    
    RunAlgo(new SimpleAlgo(account, RSIPeriod, RSILowValue, RSIHighValue), account, exchangeRateUSDHistory);
    balanceUSD = account.balanceUSD(exchangeRateUSDHistory[exchangeRateUSDHistory.length-1].Close);
    var result = RSIPeriod+","+RSILowValue+","+RSIHighValue+","+balanceUSD;
    console.log(result);
    //util.writeFile(filename, RSIPeriod, RSILowValue, RSIHighValue, balanceUSD);
}
//}while(balanceUSD < 30000);
//}while(account.balanceUSD(exchangeRateUSDHistory[exchangeRateUSDHistory.length-1]) < 50000);
