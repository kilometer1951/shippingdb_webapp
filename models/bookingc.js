const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var bookingconfirmationSchema = new mongoose.Schema({
  createdAt: { type: Date },
  Client: [{
            type: Schema.Types.ObjectId, 
            ref: 'Clients'
  }],
  Consignee: [{
            type: Schema.Types.ObjectId, 
            ref: 'Consignees'
  }],
  vessel_name: String,
  voyage_number: String,
  booking_number: String,
  equipment_size: String,
  total_number_of_container: String,
  loading_terminal: String,
  commodity_des: String,
  carrier: String,
  cut_off_date: Date,
  sail_date: Date,
  arrival_date: Date,
  return_depot: String,
  pickup_terminal: String,
  place_of_recript: String,
  port_of_loading: String,
  port_of_discharge: String,
  place_of_delivery: String,
  rate: String,
  notes: String

});
// powerOfAttroney_nraSchema.pre('save', function (next) {
//   if (this.isNew && 0 === this.Cargo.length) {
//     this.Cargo = undefined;                                                                                                                                   
//   }
//   next();
// })
module.exports = mongoose.model('BookingConfirmation', bookingconfirmationSchema);