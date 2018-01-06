const Util = require('./util.js');
const plotly = require('plotly')('Tiboh', 'bpXscfMKbSEhYRVbx0iS');
const PlotData = require('./plotData.js');

function RSIData(plotBasicData, RSIPeriod, RSIHighValue, RSILowValue){
    this.exchangeRateUSDHistory = plotBasicData.exchangeRateUSDHistory;

    this.RSILowArray = [];
    this.RSILowDateArray = [];
    this.RSIHighArray = [];
    this.RSIHighDateArray = [];
    this.RSIValueArray = [];
    this.RSIValueDateArray = [];
    this.RSILowerLineArray = [];
    this.RSIHigherLineArray = [];

    var util = new Util();

    this.update = function(index, account){
        var currentDate = this.exchangeRateUSDHistory[index].Date;

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
        var RSILowData =
        {
        x: this.RSILowDateArray,
        y: this.RSILowArray,
        mode: "markers",
        type: "scatter",
        name: "RSI-"+this.RSIPeriod+" below "+this.RSILowValue
        };
    var RSIHighData =
        {
        x: this.RSIHighDateArray,
        y: this.RSIHighArray,
        mode: "markers",
        type: "scatter",
        name: "RSI-"+this.RSIPeriod+" above "+this.RSIHighValue
        };
    var RSIValueData ={
        x: this.RSIValueDateArray,
        y: this.RSIValueArray,
        type: "scatter",
        name: "RSI-"+this.RSIPeriod+" value",
        yaxis: "y3",
        xaxis: "x"
        };
    var RSIHigherLineData ={
        x: plotBasicData.dateArray,
        y: this.RSIHigherLineArray,
        type: "scatter",
        yaxis: "y3",
        xaxis: "x"
        };
    var RSILowerLineData ={
        x: plotBasicData.dateArray,
        y: this.RSILowerLineArray,
        type: "scatter",
        yaxis: "y3",
        xaxis: "x"
        };
        Array.prototype.push.apply(plotBasicData.data,[RSILowData,RSIHighData, RSIValueData, RSIHigherLineData, RSILowerLineData]);
        // plotBasicData.addData(RSIHighData);
        // plotBasicData.addData(RSIValueData);
        // plotBasicData.addData(RSIHigherLineData);
        // plotBasicData.addData(RSILowerLineData);
        // plotBasicData.layout.yaxis3 = new Object();
        // plotBasicData.layout.yaxis3.title = "RSI";
        // plotBasicData.layout.yaxis3.domain = [0.75, 1];
    }
}

module.exports = RSIData;