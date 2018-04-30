const router = require("express").Router();
const Clients = require("../models/client");
const Cargos = require("../models/cargo");
const Country = require("../models/country");
const PowerOfAttroney_nra = require("../models/powerOfAttroney_nraModel");
const BookingConfirmation = require("../models/bookingc");
const Consignee = require("../models/consignee");
const Dock_R = require("../models/dock_Model");
const async = require('async');
const moment = require('moment');


//show route
router.get("/dock_r", function(req, res) {

    if (req.user) {
        async.parallel([

            function(callback) {
                Clients.find({}, function(err, foundData) {
                    callback(err, foundData);
                });
            },
            function(callback) {
                Dock_R
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
            res.render("main/dockRecipt", { title: 'Oldsailor Ocean Shipping LLC || Dock Receipt', clientsData: clientsData, foundAllData: foundAllData });

        });
    }
    else {

    }

});


//show route
router.get("/invoice", function(req, res) {

    if (req.user) {
        async.parallel([

            function(callback) {
                Clients.find({}, function(err, foundData) {
                    callback(err, foundData);
                });
            },
            function(callback) {
                Dock_R
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
            res.render("main/invoice", { title: 'Oldsailor Ocean Shipping LLC || Dock Receipt', clientsData: clientsData, foundAllData: foundAllData });

        });
    }
    else {

    }

});


//show route Bill of lading
router.get("/bill_lading", function(req, res) {

    if (req.user) {
        async.parallel([

            function(callback) {
                Clients.find({}, function(err, foundData) {
                    callback(err, foundData);
                });
            },
            function(callback) {
                Dock_R
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
            res.render("main/bill_of_lading", { title: 'Oldsailor Ocean Shipping LLC || Bill Of Lading', clientsData: clientsData, foundAllData: foundAllData });

        });
    }
    else {

    }

});

//edit bill of lading
router.post("/bill_of_lading/new", function(req, res) {

    var editData = {
        bill_of_lading_date: moment.parseZone(new Date()).format('l'),
        description_of_charges: req.body.description_of_charges,
        destination_agent: req.body.destination_agent,
        co_loaded_with: req.body.co_loaded_with,
        total_pre_paid: req.body.total_pre_paid,
        total_collected: req.body.total_collected,
        containerlized: req.body.containerlized,
        bill_of_lading_status: "Created"

    };

    Dock_R.findByIdAndUpdate(req.body.id, editData, function(err, upatedData) {
        // console.log(upatedData);
        res.send(upatedData);
    });

});

router.post("/bill_of_lading/:id/edit", function(req, res) {

    var editData = {
        description_of_charges: req.body.description_of_charges,
        destination_agent: req.body.destination_agent,
        co_loaded_with: req.body.co_loaded_with,
        total_pre_paid: req.body.total_pre_paid,
        total_collected: req.body.total_collected,
        containerlized: req.body.containerlized,

    };

    Dock_R.findByIdAndUpdate(req.params.id, editData, function(err, upatedData) {
        // console.log(upatedData);
        res.redirect("/bill_lading");
    });

});


router.post("/_update_cargo_dock_1_", function(req, res) {
    //search to get the cargo id
    Cargos.findOne({ _id: req.body.data.cargo_id_11 }, function(err, foundData) {
        //  console.log(foundData.Cars.length);
        //update cars weight
        Cargos.update({
                _id: req.body.data.cargo_id_11,
                Cars: { $elemMatch: { _id: req.body.data.car_id } }
            },

            {
                $set: {
                    "Cars.$.weight": req.body.data.weight

                },


            }, {
                "multi": true

            },
            function(err, updated) {
                //   console.log(updated)
                return res.send(updated)
            });


    });


});



router.post("/_update_cargo_dock_3_", function(req, res) {
    //search to get the cargo id
    Cargos.findOne({ _id: req.body.data.cargo_id_11 }, function(err, foundData) {
        // console.log(foundData.Cars.length);
        //update cars weight
        Cargos.update({
                _id: req.body.data.cargo_id_11,
                Cars: { $elemMatch: { _id: req.body.data.car_id } }
            },

            {
                $set: {
                    "Cars.$.measurement": req.body.data.measurement

                },


            }, {
                "multi": true

            },
            function(err, updated) {
                //   console.log(updated)
                return res.send(updated)
            });


    });


});




router.post("/_update_cargo_dock_2_", function(req, res) {
    //search to get the cargo id
    Cargos.findOne({ _id: req.body.data.cargo_id_11 }, function(err, foundData) {
        //console.log(foundData);
        //update cars weight
        Cargos.update({
                _id: req.body.data.cargo_id_11
            },

            {
                $set: {
                    personal_effect_weight: req.body.data.personal_effect_weight,
                    personal_effect_m: req.body.data.personal_effect_m,
                    total_weight: req.body.data.total_weight

                },


            },
            function(err, updated) {
                //console.log(updated)
                return res.send(updated)
            });


    });


});


//create dock_receipt
router.post("/dock_r/new", function(req, res) {

    var consigneedropdown = undefined;
    if (req.body.consigneedropdown !== "Select a Consignee") {
        consigneedropdown = req.body.consigneedropdown;
    }

    var bookingc_id = req.body.bookingc_id;
    var n_name = req.body.n_name;
    var n_address = req.body.n_address;
    var n_country = req.body.n_country;
    var n_pnum = req.body.n_pnum;
    var seal_num = req.body.seal_num;
    var demurrage = req.body.demurrage;
    var container_num = req.body.container_num;
    var aes_num = req.body.aes_num;
    var cleint_is_agent = req.body.cleint_is_agent;
    var originals_tobe_released = req.body.originals_tobe_released;
    var clientdropdown = req.body.clientdropdown;
    var cargo_id_ = req.body.cargo_id_;
    var fowarding_agent_ref = req.body.fowarding_agent_ref;

    var for_transhipment_to = req.body.for_transhipment_to;
    var point_and_contry_of_origin = req.body.point_and_contry_of_origin;


    var newData = {
        createdAt: moment.parseZone(new Date()).format('l'),
        BookingConfirmation: bookingc_id,
        Client: clientdropdown,
        Consignee: consigneedropdown,
        Cargo: cargo_id_,
        n_name: n_name,
        n_address: n_address,
        n_country: n_country,
        n_pnum: n_pnum,
        seal_num: seal_num,
        demurrage: demurrage,
        container_num: container_num,
        aes_num: aes_num,
        cleint_is_agent: cleint_is_agent,
        fowarding_agent_ref: fowarding_agent_ref,
        originals_tobe_released: originals_tobe_released,
        for_transhipment_to: for_transhipment_to,
        point_and_contry_of_origin: point_and_contry_of_origin
    };
    //console.log(req.body.data.cfirst_name)
    Dock_R.create(newData, function(err, newlyCreated) {
        //   console.log(newlyCreated);
        return res.send(newlyCreated);
    });
});





//Fetch d_r per client
router.get("/d_r/:id/fetch_perclient", function(req, res) {

    Dock_R
        .find({ Client: req.params.id })
        .sort('-createdAt')
        .populate("Client")
        .exec(function(err, foundData) {
            return res.send(foundData)
        });


});



//delete 
router.delete("/d_r/:id/delete", function(req, res) {
    Dock_R.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            return console.log(err);
        else
            return res.send(req.params.id);
    });

});

//bill of lading
router.get("/bill_of_lading/:id/editRoute", function(req, res) {

    if (req.user) {

        Dock_R
            .findOne({ _id: req.params.id })
            .populate("Client")
            .exec(function(err, foundData) {
                //  console.log(foundData);
                return res.render("main/bill_of_lading_edit", { title: 'Oldsailor Ocean Shipping LLC || Edit Bill of Lading', foundData: foundData, layout: false });
            });


    }
    else {
        return res.redirect('/login');
    }


});

//dock receipt
router.get("/d_r/:id/editRoute", function(req, res) {

    if (req.user) {

        Dock_R
            .findOne({ _id: req.params.id })
            .populate("Client")
            .exec(function(err, foundData) {
                //  console.log(foundData);
                return res.render("main/d_r_edit", { title: 'Oldsailor Ocean Shipping LLC || Edit Dock Receipt', foundData: foundData, layout: false });
            });


    }
    else {
        return res.redirect('/login');
    }


});

//edit form data
router.post("/d_r/:id/edit", function(req, res) {
    //check if cargo exist 

    var n_name = req.body.n_name;
    var n_address = req.body.n_address;
    var n_country = req.body.n_country;
    var n_pnum = req.body.n_pnum;
    var seal_num = req.body.seal_num;
    var demurrage = req.body.demurrage;
    var container_num = req.body.container_num;
    var aes_num = req.body.aes_num;
    var cleint_is_agent = req.body.cleint_is_agent;
    var originals_tobe_released = req.body.originals_tobe_released;
    var fowarding_agent_ref = req.body.fowarding_agent_ref;
    var point_and_contry_of_origin = req.body.point_and_contry_of_origin;
    var for_transhipment_to = req.body.for_transhipment_to;


    var editData = {
        n_name: n_name,
        n_address: n_address,
        n_country: n_country,
        n_pnum: n_pnum,
        seal_num: seal_num,
        demurrage: demurrage,
        container_num: container_num,
        aes_num: aes_num,
        cleint_is_agent: cleint_is_agent,
        originals_tobe_released: originals_tobe_released,
        fowarding_agent_ref: fowarding_agent_ref,
        point_and_contry_of_origin: point_and_contry_of_origin,
        for_transhipment_to: for_transhipment_to,

    };

    Dock_R.findByIdAndUpdate(req.params.id, editData, function(err, upatedData) {
        // console.log(upatedData);
        res.redirect("/dock_r");
    });

});



//email
router.get("/d_r/:id/email/:client_id/cargo/:cargo_id/consignee/:consignee_id/booking_c/:bc_id", function(req, res) {

    async.parallel([
        function(callback) {
            Dock_R
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
        function(callback) {
            BookingConfirmation
                .findOne({ _id: req.params.bc_id })
                .sort('-createdAt')
                .exec(function(err, foundAllData) {
                    callback(err, foundAllData);
                });
        },
        function(callback) {
            Cargos
                .findOne({ _id: req.params.cargo_id })
                .sort('-createdAt')
                .exec(function(err, foundAllData) {
                    callback(err, foundAllData);
                });
        },
        function(callback) {
            Consignee
                .findOne({ _id: req.params.consignee_id })
                .populate("Country")
                .exec(function(err, foundAllData) {
                    callback(err, foundAllData)
                });
        }


    ], (err, results) => {
        var Dock_R = results[0];
        var ClientData = results[1];
        var BookingConfirmation = results[2];
        var Cargos = results[3];
        var Consignee = results[4];
        //    console.log(BookingConfirmation)
        res.render("main/email_dr", { layout: false, Dock_R: Dock_R, ClientData: ClientData, BookingConfirmation: BookingConfirmation, Cargos: Cargos, Consignee: Consignee });



    });



});




//email 2
router.get("/d_r_2/:id/email/:client_id/cargo/:cargo_id/consignee/:consignee_id/booking_c/:bc_id", function(req, res) {

    async.parallel([
        function(callback) {
            Dock_R
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
        function(callback) {
            BookingConfirmation
                .findOne({ _id: req.params.bc_id })
                .sort('-createdAt')
                .exec(function(err, foundAllData) {
                    callback(err, foundAllData);
                });
        },
        function(callback) {
            Cargos
                .findOne({ _id: req.params.cargo_id })
                .sort('-createdAt')
                .exec(function(err, foundAllData) {
                    callback(err, foundAllData);
                });
        },
        function(callback) {
            Consignee
                .findOne({ _id: req.params.consignee_id })
                .populate("Country")
                .exec(function(err, foundAllData) {
                    callback(err, foundAllData)
                });
        }


    ], (err, results) => {
        var Dock_R = results[0];
        var ClientData = results[1];
        var BookingConfirmation = results[2];
        var Cargos = results[3];
        var Consignee = results[4];
        //    console.log(BookingConfirmation)
        res.render("main/email_dr_2", { layout: false, Dock_R: Dock_R, ClientData: ClientData, BookingConfirmation: BookingConfirmation, Cargos: Cargos, Consignee: Consignee });



    });



});



//email bill of lading
router.get("/bill_of_lading__/:id/email/:client_id/cargo/:cargo_id/consignee/:consignee_id/booking_c/:bc_id", function(req, res) {

    async.parallel([
        function(callback) {
            Dock_R
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
        function(callback) {
            BookingConfirmation
                .findOne({ _id: req.params.bc_id })
                .sort('-createdAt')
                .exec(function(err, foundAllData) {
                    callback(err, foundAllData);
                });
        },
        function(callback) {
            Cargos
                .findOne({ _id: req.params.cargo_id })
                .sort('-createdAt')
                .exec(function(err, foundAllData) {
                    callback(err, foundAllData);
                });
        },
        function(callback) {
            Consignee
                .findOne({ _id: req.params.consignee_id })
                .populate("Country")
                .exec(function(err, foundAllData) {
                    callback(err, foundAllData)
                });
        }


    ], (err, results) => {
        var Dock_R = results[0];
        var ClientData = results[1];
        var BookingConfirmation = results[2];
        var Cargos = results[3];
        var Consignee = results[4];
        //    console.log(BookingConfirmation)
        res.render("main/bill_of_lading__email", { layout: false, Dock_R: Dock_R, ClientData: ClientData, BookingConfirmation: BookingConfirmation, Cargos: Cargos, Consignee: Consignee });



    });



});




module.exports = router
