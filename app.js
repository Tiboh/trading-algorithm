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

function RunAlgo(algorithmType, csvFile, startDate, endDate) {
    var data = new Data(csvFile);    
    var account = new Account(10000);
    var algo;

    switch(algorithmType){
        case AlgoType.STATIC: algo = new StaticAlgo(account); break;
        case AlgoType.RANDOM: algo = new RandomAlgo(account); break;
        case AlgoType.SIMPLE: algo = new SimpleAlgo(account); break;
        default:
            throw new Error("This algorithm type is not recognized '" + algorithmType + "'");
            break;
    }

    var dateArray = [];
    var balanceUSDArray = [];
    var fundsUSDArray = [];
    var fundsCryptoArray = [];
    var cryptoValueArray = [];

    //var exchangeRateUSDHistory = data.getBuyPrice(startDate, endDate);
    var exchangeRateUSDHistory = data.history;
    for(i = 0 ; i < exchangeRateUSDHistory.length ; i++){
        algo.update(exchangeRateUSDHistory[i].Close);
        dateArray.push(exchangeRateUSDHistory[i].Date);
        balanceUSDArray.push(account.balanceUSD(exchangeRateUSDHistory[i].Close));
        fundsUSDArray.push(account.fundsUSD);
        fundsCryptoArray.push(account.fundsCrypto);
        cryptoValueArray.push(exchangeRateUSDHistory[i].Close);
    }
    console.log(account.balanceUSD(exchangeRateUSDHistory[exchangeRateUSDHistory.length-1].Close));
    
    PlotData(algorithmType, dateArray, balanceUSDArray, fundsUSDArray, fundsCryptoArray, cryptoValueArray);
}

function PlotData(algorithmType, dateArray, balanceUSDArray, fundsUSDArray, fundsCryptoArray, cryptoValueArray){
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
        yaxis: "y2"
        };
    var cryptoValueData =
        {
        x: dateArray,
        y: cryptoValueArray,
        type: "scatter",
        name: "Ƀ value in $"
        };
    var data = [balanceUSDData,fundsUSDData,fundsCryptoData,cryptoValueData];

    var layout = {
        title: algorithmType,
        yaxis: {
            title: "$"
        },
        yaxis2: {
        title: "Ƀ",
        overlaying: "y",
        side: "right"
        }
    };
    var graphOptions = {layout: layout, filename: "date-axes", fileopt: "overwrite"};
    plotly.plot(data, graphOptions, function (err, msg) {
        console.log(msg);
        console.log(err);
    });
}

RunAlgo(AlgoType.STATIC, 'csv/BTC.csv', '2017-01-17', '2017-02-19');