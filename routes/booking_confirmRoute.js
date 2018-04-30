const router = require("express").Router();
const Clients = require("../models/client");
const Cargos = require("../models/cargo");
const Country = require("../models/country");
const PowerOfAttroney_nra = require("../models/powerOfAttroney_nraModel");
const BookingConfirmation = require("../models/bookingc");
const async = require('async');
const moment = require('moment');


//show route
router.get("/bookingconfirmation", function(req, res) {

    if (req.user) {
        async.parallel([

            function(callback) {
                Clients.find({}, function(err, foundData) {
                    callback(err, foundData);
                });
            },
            function(callback) {
                BookingConfirmation
                    .find({})
                    .populate("Client")
                    .sort('-createdAt')
                    .exec(function(err, foundAllData) {
                        callback(err, foundAllData);
                    });
            }

        ], (err, results) => {
            var clientsData = results[0];
            var foundAllData = results[1];
            res.render("main/booking_confirm", { title: 'Oldsailor Ocean Shipping LLC || Booking Confirmation', clientsData: clientsData, foundAllData: foundAllData });

        });
    }
    else {

    }

});


//new
router.post("/b_c/new", function(req, res) {
    //check if cargo exist 
    var cosignee = '';


    if (req.body.consigneedropdown !== "Select a Consignee") {
        cosignee = req.body.consigneedropdown;

    }
    else {
        cosignee = undefined;
    }


    var newData = new BookingConfirmation();

    newData.createdAt = moment.parseZone(new Date()).format('l'),
        newData.Client = req.body.clientdropdown,
        newData.Consignee = cosignee,

        newData.vessel_name = req.body.vessel_name,
        newData.voyage_number = req.body.voyage_number,
        newData.booking_number = req.body.booking_number,
        newData.equipment_size = req.body.equipment_size,
        newData.total_number_of_container = req.body.total_number_of_container,
        newData.loading_terminal = req.body.loading_terminal,
        newData.commodity_des = req.body.commodity_des,
        newData.carrier = req.body.carrier,
        newData.cut_off_date = req.body.cut_off_date,
        newData.sail_date = req.body.sail_date,
        newData.arrival_date = req.body.arrival_date,
        newData.return_depot = req.body.return_depot,
        newData.pickup_terminal = req.body.pickup_terminal,
        newData.place_of_recript = req.body.place_of_recript,


        newData.port_of_loading = req.body.port_of_loading,
        newData.port_of_discharge = req.body.port_of_discharge,
        newData.place_of_delivery = req.body.place_of_delivery,

        newData.rate = req.body.rate,
        newData.notes = req.body.notes



    //add
    newData.save(function(err, newlyCreated) {
        //  console.log(newlyCreated);
        return res.send(newlyCreated);
    });

});




//delete 
router.delete("/bc/:id/delete", function(req, res) {
    BookingConfirmation.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            return console.log(err);
        else
            return res.send(req.params.id);
    })

});


//email
router.get("/bc/:id/email/:client_id", function(req, res) {

    async.parallel([
        function(callback) {
            BookingConfirmation
                .findOne({ _id: req.params.id })
                .exec(function(err, foundAllData) {
                    callback(err, foundAllData)
                });
        },

        function(callback) {
            Clients
                .findOne({ _id: req.params.client_id })
                .populate("City")
                .populate("State")
                .exec(function(err, foundAllData) {
                    callback(err, foundAllData)
                });
        },
        //get all his NRA
        function(callback) {
            PowerOfAttroney_nra
                .find({ Client: req.params.client_id })
                .sort('-createdAt')
                .exec(function(err, foundAllData) {
                    callback(err, foundAllData);
                });
        }

    ], (err, results) => {
        var foundAllData_1 = results[0];
        var ClientData = results[1];
        var foundAllData = results[2];
        res.render("main/bc_email", { layout: false, foundAllData_1: foundAllData_1, ClientData: ClientData, foundAllData: foundAllData });



    });



});



//Fetch poa_nra per client
router.get("/bc/:id/fetch_perclient", function(req, res) {

    BookingConfirmation
        .find({ Client: req.params.id })
        .sort('-createdAt')
        .populate("Client")
        .exec(function(err, foundData) {
            return res.send(foundData)
        });


});



//delete

//Fetch poa_nra per client
router.get("/bc/:id/editRoute", function(req, res) {

    if (req.user) {

        BookingConfirmation
            .findOne({ _id: req.params.id })
            .populate("Client")
            .exec(function(err, foundData) {
                //  console.log(foundData);
                return res.render("main/bc_edit", { title: 'Oldsailor Ocean Shipping LLC || Edit Booking Confirmation', foundData: foundData, layout: false });
            });


    }
    else {
        return res.redirect('/login');
    }


});


//edit form data
router.post("/bc/:id/edit", function(req, res) {
    //check if cargo exist 



    var editData = {

        vessel_name: req.body.vessel_name,
        voyage_number: req.body.voyage_number,
        booking_number: req.body.booking_number,
        equipment_size: req.body.equipment_size,
        total_number_of_container: req.body.total_number_of_container,
        loading_terminal: req.body.loading_terminal,
        commodity_des: req.body.commodity_des,
        carrier: req.body.carrier,
        cut_off_date: req.body.cut_off_date,
        sail_date: req.body.sail_date,
        arrival_date: req.body.arrival_date,
        return_depot: req.body.return_depot,
        pickup_terminal: req.body.pickup_terminal,
        place_of_recript: req.body.place_of_recript,


        port_of_loading: req.body.port_of_loading,
        port_of_discharge: req.body.port_of_discharge,
        place_of_delivery: req.body.place_of_delivery,

        rate: req.body.rate,
        notes: req.body.notes

    };

    BookingConfirmation.findByIdAndUpdate(req.params.id, editData, function(err, upatedData) {
        // console.log(upatedData);
        res.redirect("/bookingconfirmation");
    });

});


module.exports = router
