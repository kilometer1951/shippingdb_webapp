var mongoose = require("mongoose");
var Schema   = mongoose.Schema;



var ConsigneeSchema = new mongoose.Schema({
   createdAt: { type: Date, default: Date.now },
   first_name: String,
   last_name: String,
   full_name: String,
   pnum: String,
   email: String,
   address: String,
   city: String,
   state: String,
   Country: {
       type: Schema.Types.ObjectId,
       ref: 'Countries'
   },
   postalcode: String,
   careof: String,
   Client: {
       type: Schema.Types.ObjectId,
       ref: 'Clients'
   }
   
});


module.exports = mongoose.model('Consignees', ConsigneeSchema);