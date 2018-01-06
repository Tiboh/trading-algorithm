const Util = require('./util.js');
const plotly = require('plotly')('Tiboh', 'bpXscfMKbSEhYRVbx0iS');

function PlotData(exchangeRateUSDHistory, algorithmType){
    this.exchangeRateUSDHistory = exchangeRateUSDHistory;
    this.algorithmType = algorithmType;

    RSILowValue = 30;
    RSIHighValue = 70;
    RSIPeriod = 14;

    this.dateArray = [];
    this.balanceUSDArray = [];
    this.fundsUSDArray = [];
    this.fundsCryptoArray = [];
    this.cryptoValueArray = [];

    this.RSILowArray = [];
    this.RSILowDateArray = [];
    this.RSIHighArray = [];
    this.RSIHighDateArray = [];
    this.RSIValueArray = [];
    this.RSIValueDateArray = [];
    this.RSILowerLineArray = [];
    this.RSIHigherLineArray = [];

    var util = new Util();

    this.data = [];

    this.update = function(index, account){
        var currentDate = this.exchangeRateUSDHistory[index].Date;
        this.dateArray.push(currentDate);
        this.balanceUSDArray.push(account.balanceUSD(this.exchangeRateUSDHistory[index].Close));
        this.fundsUSDArray.push(account.fundsUSD);
        this.fundsCryptoArray.push(account.fundsCrypto);
        this.cryptoValueArray.push(this.exchangeRateUSDHistory[index].Close);

        if(index > RSIPeriod){
            var RSI = util.getRSI(this.exchangeRateUSDHistory.slice(index-RSIPeriod, index).map(a => a.Close), index);
            if(RSI < RSILowValue){
                this.RSILowArray.push(this.exchangeRateUSDHistory[index].Close);
                this.RSILowDateArray.push(currentDate);
            }else if(RSI > RSIHighValue){
                this.RSIHighArray.push(this.exchangeRateUSDHistory[index].Close);
                this.RSIHighDateArray.push(currentDate);
            }
            this.RSIValueArray.push(RSI);
            this.RSIValueDateArray.push(currentDate);
        }
        this.RSILowerLineArray.push(RSILowValue);
        this.RSIHigherLineArray.push(RSIHighValue);
    }

    this.prepareData = function(){
        var balanceUSDData =
        {
            x: this.dateArray,
            y: this.balanceUSDArray,
            type: "scatter",
            name: "Balance in $"
        };
        var fundsUSDData = 
            {
            x: this.dateArray,
            y: this.fundsUSDArray,
            type: "scatter",
            name: "Funds in $"
            };
        var fundsCryptoData =
            {
            x: this.dateArray,
            y: this.fundsCryptoArray,
            type: "scatter",
            name: "Funds in Ƀ",
            yaxis: "y2"
            };
        var cryptoValueData =
            {
            x: this.dateArray,
            y: this.cryptoValueArray,
            type: "scatter",
            name: "Ƀ value in $"
            };
        // var RSILowData =
        //     {
        //     x: this.RSILowDateArray,
        //     y: this.RSILowArray,
        //     mode: "markers",
        //     type: "scatter",
        //     name: "RSI-"+this.RSIPeriod+" below "+this.RSILowValue
        //     };
        // var RSIHighData =
        //     {
        //     x: this.RSIHighDateArray,
        //     y: this.RSIHighArray,
        //     mode: "markers",
        //     type: "scatter",
        //     name: "RSI-"+this.RSIPeriod+" above "+this.RSIHighValue
        //     };
        // var RSIValueData ={
        //     x: this.RSIValueDateArray,
        //     y: this.RSIValueArray,
        //     type: "scatter",
        //     name: "RSI-"+this.RSIPeriod+" value",
        //     yaxis: "y3",
        //     xaxis: "x"
        //     };
        // var RSIHigherLineData ={
        //     x: this.dateArray,
        //     y: this.RSIHigherLineArray,
        //     type: "scatter",
        //     yaxis: "y3",
        //     xaxis: "x"
        //     };
        // var RSILowerLineData ={
        //     x: this.dateArray,
        //     y: this.RSILowerLineArray,
        //     type: "scatter",
        //     yaxis: "y3",
        //     xaxis: "x"
        //     };
        this.data = [balanceUSDData,fundsUSDData,fundsCryptoData,cryptoValueData];//, RSILowData, RSIHighData, RSIValueData, RSIHigherLineData, RSILowerLineData];
        this.layout = {
            title: this.algorithmType,
            yaxis: {
                title: "$",
                domain: [0, 0.65]
            },
            yaxis3: {
                title: "RSI",
                domain: [0.75, 1]
            },
            yaxis2 : {
                title: "Ƀ",
                overlaying: "y",
                side: "right"
            }
        };
    }

    this.addData = function (newData){
        this.data.push(newData);
    }

    this.plotData = function(){
        var graphOptions = {layout: this.layout, filename: "date-axes", fileopt: "overwrite"};
        plotly.plot(this.data, graphOptions, function (err, msg) {
            console.log(msg);
            console.log(err);
        });
    }
}

module.exports = PlotData;