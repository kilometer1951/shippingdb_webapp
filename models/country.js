const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var CountrySchema = new mongoose.Schema({
  countryname: String,
  States: [{
            type: Schema.Types.ObjectId, 
            ref: 'States'
  }]
});



module.exports = mongoose.model('Countries', CountrySchema);