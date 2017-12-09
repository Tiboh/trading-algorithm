var loader = require('csv-load-sync');
var jsonQuery = require('json-query')

function Data(filename){
    this.filename=filename;
    this.history = loader(filename);
};

// Data.prototype.getBuyPrice = function(startDate, endDate){
//     return jsonQuery('[* Date <= '+startDate+' & Date <= '+endDate+']', {
//     data: this.history
//     }).value       
// };


module.exports = Data;