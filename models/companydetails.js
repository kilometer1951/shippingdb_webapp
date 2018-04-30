const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var CompanySchema = new mongoose.Schema({
   fmcotino: String,
   companyname: String,
   address: String,
   State: String,
   City: String,
   zipcode: String,
   phonenumber: String,
   fax: String,
   email: String,
   photo: String,
   hasEnteredDetails: Boolean
});



module.exports = mongoose.model('Company', CompanySchema);
