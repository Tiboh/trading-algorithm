var loader = require('csv-load-sync');

function Data(filename='csv/BTC.csv'){
    this.filename=filename;
    this.history = loader(filename);
};

Data.prototype.getBuyPrice = function(index){
    return this.history[index];
};

module.exports = Data;