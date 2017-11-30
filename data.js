var loader = require('csv-load-sync');
var jsonQuery = require('json-query')

function Data(filename='csv/AMZN.csv'){
    this.filename=filename;
    this.history = loader(filename);
};

Data.prototype.getBuyPrice = function(startDate, endDate){
    return jsonQuery('[* Date <= '+startDate+' & Date <= '+endDate+'].Close', {
    data: this.history
    }).value       
};

module.exports = Data;