const router = require("express").Router();
const Clients = require("../models/client");
const Cargos = require("../models/cargo");
const Country = require("../models/country");
const PowerOfAttroney_nra = require("../models/powerOfAttroney_nraModel");
const BookingConfirmation = require("../models/bookingc");
const async = require('async');
const moment = require('moment');


router.get("/merge_nra_booking/nra_num/:nra_id/bc_num/:bc_id/email/:client_id", function(req, res) {
    async.parallel([

        //nra
        function(callback) {
            PowerOfAttroney_nra
                .find({ _id: req.params.nra_id })
                .populate("Client")
                .exec(function(err, foundAllData) {
                    //    console.log(foundAllData[0].Client[0].full_name)
                    callback(err, foundAllData)
                });
        },
        //booking
        function(callback) {
            BookingConfirmation
                .findOne({ _id: req.params.bc_id })
                .exec(function(err, foundAllData) {
                    callback(err, foundAllData)
                });
        },

        //client
        function(callback) {
            Clients
                .findOne({ _id: req.params.client_id })
                .populate("City")
                .populate("State")
                .exec(function(err, foundAllData) {
                    callback(err, foundAllData)
                });
        }

    ], (err, results) => {
        var foundAllData = results[0];
        var foundAllData_1 = results[1];
        var ClientData = results[2];
        res.render("main/nra_to_bookingc", { layout: false, foundAllData: foundAllData, foundAllData_1: foundAllData_1, ClientData: ClientData });

    });
});

//////////////////////////

router.get("/merge_nra_booking_3/nra_num/:nra_id/bc_num/:bc_id/email/:client_id", function(req, res) {
    async.parallel([

        //nra
        function(callback) {
            PowerOfAttroney_nra
                .findOne({ _id: req.params.nra_id })
                .populate("Client")
                .populate("Cargo")
                .populate("Consignee")
                .exec(function(err, foundAllData) {
                    //    console.log(foundAllData[0].Client[0].full_name)
                    callback(err, foundAllData)
                });
        },
        //booking
        function(callback) {
            BookingConfirmation
                .findOne({ _id: req.params.bc_id })
                .exec(function(err, foundAllData) {
                    callback(err, foundAllData)
                });
        },

        //client
        function(callback) {
            Clients
                .findOne({ _id: req.params.client_id })
                .populate("City")
                .populate("State")
                .exec(function(err, foundAllData) {
                    callback(err, foundAllData)
                });
        }

    ], (err, results) => {
        var foundAllData = results[0];
        var foundAllData_1 = results[1];
        var ClientData = results[2];
        var ConsigneeCountryname = "";

        //get consignee country name
        if (foundAllData.Consignee.length !== 0) {
            Country.findOne({ _id: foundAllData.Consignee[0].Country }, function(err, countrydata) {
                ConsigneeCountryname = countrydata.countryname

                //check for data
                // console.log(foundAllData.Cargo.length);

                res.render("main/nra_to_bookingc_all_3", { layout: false, foundAllData: foundAllData, foundAllData_1: foundAllData_1, ClientData: ClientData, ConsigneeCountryname: ConsigneeCountryname });
            });
        }
        else {
            res.render("main/nra_to_bookingc_all_3", { layout: false, foundAllData: foundAllData, foundAllData_1: foundAllData_1, ClientData: ClientData });
        }



    });
});

////////////////////////// two poa and nra

router.get("/poa_nra_2/:nra_id/email_1/:client_id", function(req, res) {
    async.parallel([

        //nra
        function(callback) {
            PowerOfAttroney_nra
                .findOne({ _id: req.params.nra_id })
                .populate("Client")
                .populate("Cargo")
                .populate("Consignee")
                .exec(function(err, foundAllData) {
                    //    console.log(foundAllData[0].Client[0].full_name)
                    callback(err, foundAllData)
                });
        },

        //client
        function(callback) {
            Clients
                .findOne({ _id: req.params.client_id })
                .populate("City")
                .populate("State")
                .exec(function(err, foundAllData) {
                    callback(err, foundAllData)
                });
        }

    ], (err, results) => {
        var foundAllData = results[0];
        var ClientData = results[1];
        var ConsigneeCountryname = "";

        //get consignee country name
        if (foundAllData.Consignee.length !== 0) {
            Country.findOne({ _id: foundAllData.Consignee[0].Country }, function(err, countrydata) {
                ConsigneeCountryname = countrydata.countryname

                //check for data
                // console.log(foundAllData.Cargo.length);

                res.render("main/poa_nra_email_2", { layout: false, foundAllData: foundAllData, ClientData: ClientData, ConsigneeCountryname: ConsigneeCountryname });
            });
        }
        else {
            res.render("main/poa_nra_email_2", { layout: false, foundAllData: foundAllData, ClientData: ClientData });
        }



    });
});

module.exports = router
