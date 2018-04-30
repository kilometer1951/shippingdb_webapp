const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var powerOfAttroney_nraSchema = new mongoose.Schema({
  createdAt: { type: Date },
  Client: [{
            type: Schema.Types.ObjectId, 
            ref: 'Clients'
  }],
  Consignee: [{
            type: Schema.Types.ObjectId, 
            ref: 'Consignees'
  }],
  Cargo: [{
            type: Schema.Types.ObjectId, 
            ref: 'Cargo'
  }],
  portdestination: String,
  carrier: String,
  insurance: String,
  typeofshipment: String,
  typeofpayment: String,
  effective_date: Date,
  expiration: Date,
  carrier_rep: String,
  bill_of_lading_oring: String,
  ocean_port_of_loading: String,
  bill_of_lading_destination: String,
  port_of_discharge: String,
  rate: String,
  rate_basis: String,
  cargo_qantity: String,
  minimum: String,
  maximum: String,
  origin_service: String,
  destination_service: String,
  special_conditions: String,
  commodity: String,
  attachment_status: Boolean

});
// powerOfAttroney_nraSchema.pre('save', function (next) {
//   if (this.isNew && 0 === this.Cargo.length) {
//     this.Cargo = undefined;                                                                                                                                   
//   }
//   next();
// })
module.exports = mongoose.model('PowerOfAttroney_nra', powerOfAttroney_nraSchema);