const router = require("express").Router();
const Clients = require("../models/client");
const Cargos = require("../models/cargo");
const async = require('async');
const moment = require('moment');






//CONSIGNEE
router.get('/cargo', function(req, res) {
    if (req.user) {
        //get clients

        async.parallel([

            function(callback) {
                Clients.find({}, function(err, foundData) {
                    callback(err, foundData);
                });
            },
            function(callback) {
                Cargos.find({})
                    .populate("Client")
                    .exec(function(err, foundData) {
                        callback(err, foundData);
                    });
            }

        ], (err, results) => {
            var clientsData = results[0];
            var CargoData = results[1];
            return res.render("main/cargo", { title: 'Oldsailor Ocean Shipping LLC || Cargo', clientsData: clientsData, CargoData: CargoData });
        });

    }
    else {
        return res.redirect('/login');
    }
});



//CONSIGNEE
router.get('/cargo/displaynewcargo', function(req, res) {
    if (req.user) {
        //get clients

        async.parallel([

            function(callback) {
                Clients.find({}, function(err, foundData) {
                    callback(err, foundData);
                });
            }

        ], (err, results) => {
            var clientsData = results[0];
            return res.render("main/newCargo", { title: 'Oldsailor Ocean Shipping LLC || New Cargo', clientsData: clientsData, layout: false });
        });

    }
    else {
        return res.redirect('/login');
    }
});



//check per day
router.get("/checkcargourl__/:id", function(req, res) {
    //  console.log(req.params.id);
    var date = new Date();
    date.setHours(0, 0, 0, 0)
    //console.log(date)

    Cargos.findOne({ createdAt: date, Client: req.params.id }, function(err, foundData) {
        if (foundData) {
            //       console.log("here")
            return res.send(foundData._id);
        }
        else {
            return res.send("");
        }

    });
});




router.post("/cargo/new", function(req, res) {
    //check if cargo exist 
    //   var vin = "";
    var car = undefined;
    // if (req.body.data.vin !== "") {
    //     vin = req.body.data.vin;
    // }

    if (req.body.data.cardetails !== "") {
        car = {
            vin: req.body.data.vin,
            aes: req.body.data.aes,
            cardetails: req.body.data.cardetails,


        }
    }



    if (req.body.data.cargo_id === "") {
        //cargo does not exist add

        var newData = {
            createdAt: moment.parseZone(new Date()).format('l'),
            Cars: car,
            Client: req.body.data.client_ID,
            personal_effect: req.body.data.personal_effect
        };

        //add
        Cargos.create(newData, function(err, newlyCreated) {
            // console.log(newlyCreated);
            return res.send(newlyCreated);
        });
    }
    else {
        //cargo exist update

        async.parallel([
            function(callback) {
                //update personal effect
                Cargos.findByIdAndUpdate(req.body.data.cargo_id, { personal_effect: req.body.data.personal_effect },
                    function(err, updatedData) {
                        callback(err, updatedData);
                    });
            },
            function(callback) {
                //push new cars into the array
                Cargos.findOne({ _id: req.body.data.cargo_id },
                    function(err, cargos) {
                        cargos.Cars.push(car);
                        cargos.save();
                        callback(err, cargos);
                    });
            }
        ], function(err, results) {
            var result1 = results[0];
            var cars = results[1];
            //console.log(result1.personal_effect);
            console.log(cars.Cars);
            return res.send(result1);
        });


    }
});



//Add More Cars
router.post("/cargo/:id/addmorecars", function(req, res) {
    //check if cargo exist 
    // var vin = "";
    // if (req.body.data.vin !== "") {
    //     vin = "VIN:" + req.body.data.vin;
    // }

    //check for cardetails

    var car = {
        vin: req.body.data.vin,
        aes: req.body.data.aes,
        cardetails: req.body.data.cardetails,


    }
    //update Cars Array
    //push new cars into the array
    Cargos.findOne({ _id: req.params.id },
        function(err, cargos) {

            //check if there is a car before pushing
            if (req.body.data.cardetails !== "") {
                cargos.Cars.push(car);
                cargos.save();
                return res.send(cargos);
            }
            else {
                return res.send(false);
            }


        });

});


//Fetch Cargo per client by name
router.get("/cargo/:value/fetchCargo_perclient", function(req, res) {
    if ("Display cargo per client" === req.params.value) {
        Cargos
            .find({})
            .populate("Client")
            .exec(function(err, foundAllData) {
                return res.send(foundAllData)
            });

    }
    else {
        //get that clients cargos


        // console.log();
        Cargos
            .find({ Client: req.params.value })
            .populate('Client')
            .exec(function(err, foundData) {
                // console.log(foundData);
                return res.send(foundData)

            });


    }
});



//display one cargo
router.get('/cargo/:id/oneCargo', function(req, res) {
    if (req.user) {
        Cargos.findOne({ _id: req.params.id })
            .populate("Client")
            .exec(function(err, foundData) {
                //console.log(foundData);
                res.send(foundData);
            });

    }
    else {
        return res.redirect('/login');
    }
});


//display edit cargo route
router.get('/cargo/:id/editRoute', function(req, res) {
    if (req.user) {
        Cargos.findOne({ _id: req.params.id })
            .populate("Client")
            .exec(function(err, foundData) {
                //console.log(foundData);
                res.render("main/editCargo", { layout: false, foundData: foundData });
            });

    }
    else {
        return res.redirect('/login');
    }
});

//edit car post route
router.post("/cargo/:cargo_id/edit", function(req, res) {
    Cargos.update({
            _id: req.params.cargo_id,
            Cars: { $elemMatch: { _id: req.body.data.car_id } }
        },

        {
            $set: {
                "Cars.$.cardetails": req.body.data.cardetails,
                "Cars.$.aes": req.body.data.aes,
                "Cars.$.vin": req.body.data.vin
            },


        }, {
            "multi": true

        },
        function(err, updated) {
            // console.log(updated)
            return res.send(updated)
        });
});

//edit personal effect
router.post("/cargo/:cargo_id/edit_personaleffect", function(req, res) {
    Cargos.findByIdAndUpdate(req.params.cargo_id, { personal_effect: req.body.data.personal_effect }, function(err, updatedData) {
        res.send(updatedData);
    });
});


//delete cargo
router.delete("/cargo/:id/delete", function(req, res) {
    Cargos.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            return console.log(err);
        else
            return res.send(req.params.id);
    })

});


//delete Car
router.post("/cars/:car_id/delete/:cargo_id", function(req, res) {
    Cargos.update({
            _id: req.params.cargo_id

        }, {
            "$pull": {
                "Cars": {
                    "_id": req.params.car_id
                }
            }
        },

        {
            safe: true,
            multi: true
        },
        function(err, updated) {
            // console.log(updated);
            res.send(updated)
        });
    // console.log(req.params.car_id);
});





// Cargos.find( { _id: req.params.cargo_id }, { Cars: { $elemMatch: { _id: req.body.data.car_id } } } ,
//      function(err, cargos) {
//          console.log(cargos[0])
//         // cargos[0].Cars.push(car);
//         // cargos[0].save();
//         // return res.send(cargos);
//   });



module.exports = router
