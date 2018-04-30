const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var CitySchema = new mongoose.Schema({
  cityname: String,
  States: {
            type: Schema.Types.ObjectId, 
            ref: 'States'
  }
  
});



module.exports = mongoose.model('Cities', CitySchema);