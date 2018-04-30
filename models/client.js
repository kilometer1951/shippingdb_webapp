var mongoose = require("mongoose");
var Schema   = mongoose.Schema;



var ClientsSchema = new mongoose.Schema({
   createdAt: { type: Date },
   first_name: String,
   last_name: String,
   full_name: String,
   pnum: String,
   email: String,
   address: String,
   City: {
       type: Schema.Types.ObjectId,
       ref: 'Cities'
   },
   State: {
       type: Schema.Types.ObjectId,
       ref: 'States'
   },
   zipcode: String,
   tax: String,
   passport: String,
   fax: String,
   ssn: String
});


module.exports = mongoose.model('Clients', ClientsSchema);