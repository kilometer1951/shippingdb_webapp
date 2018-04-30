const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var CargoSchema = new mongoose.Schema({
  createdAt: { type: Date },
  Cars: [{
    vin: String,
    aes: String,
    cardetails: String,
    weight: String,
    measurement: String
  }],
  personal_effect: String,
  total_weight: String,
  personal_effect_weight: String,
  personal_effect_m: String,
  Client: [{
    type: Schema.Types.ObjectId,
    ref: 'Clients'
  }]
});



module.exports = mongoose.model('Cargo', CargoSchema);
