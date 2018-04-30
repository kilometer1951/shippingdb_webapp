const mongoose = require("mongoose");
const Schema = mongoose.Schema;



var StateSchema = new mongoose.Schema({
    statename: String,
    Country: {
        type: Schema.Types.ObjectId,
        ref: 'Countries'
    }
});




module.exports = mongoose.model('States', StateSchema);
