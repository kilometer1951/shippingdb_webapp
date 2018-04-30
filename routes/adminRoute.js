const router = require("express").Router();
const Country = require("../models/country");
const Clients = require("../models/client");
const States = require("../models/state");
const Cities = require("../models/city");
const Cargos = require("../models/cargo");
const async = require('async');
const moment = require('moment');




//CONSIGNEE
router.get('/admin/index', function(req, res) {

    if (req.user) {
        async.parallel([
            function(callback) {
                //display countries
                Country.find({}, function(err, data) {
                    callback(err, data);
                })

            },
            function(callback) {
                //display countries
                States.find({}, function(err, data) {
                    callback(err, data);
                })

            },
            function(callback) {
                //display countries
                Cities.find({}, function(err, data) {
                    callback(err, data);
                })

            }
        ], (err, results) => {
            var Country = results[0];
            var States = results[1];
            var Cities = results[2];
            return res.render("admin/index", { title: 'Oldsailor Ocean Shipping LLC || Home', Country: Country, States: States, Cities: Cities, layout: 'admin_layout' });

        })

    }
    else {
        return res.redirect('/login');
    }


});


router.post("/newCountry/:countryname", function(req, res) {
    Country.create({ countryname: req.params.countryname }, function(err, newlyCreated) {
        console.log(newlyCreated);
        return res.send(newlyCreated);
    })
});

router.post("/edit/:countryname/:id/country", function(req, res) {
    Country.findByIdAndUpdate(req.params.id, { countryname: req.params.countryname }, function(err, updated) {
        console.log(updated);
        return res.send(updated);
    })
});

router.get("/getcontryname/:id", function(req, res) {
    Country.findById(req.params.id, function(err, foundData) {
        return res.send(foundData);
    });
});


router.post("/delete/:id/country", function(req, res) {
    Country.findByIdAndRemove(req.params.id, function(err, removed) {
        return res.send(removed);
    });
});


router.post("/newstate/:statename/:country_dropdown", function(req, res) {
    States.create({ statename: req.params.statename, Country: req.params.country_dropdown }, function(err, newlyCreated) {
        console.log(newlyCreated);
        return res.send(newlyCreated);
    })
});




router.post("/delete/:id/state", function(req, res) {
    States.findByIdAndRemove(req.params.id, function(err, removed) {
        return res.send(removed);
    });
});


router.get("/getstatename/:id", function(req, res) {
    async.parallel([
        function(callback) {
            States.findById(req.params.id,
                function(err, foundData) {
                    callback(err, foundData)
                });
        },
        function(callback) {
            Country.find({}, function(err, foundData) {
                callback(err, foundData);
            });
        }
    ], (err, results) => {
        return res.send({
            States: results[0],
            Country: results[1],

        });
    })

});

router.post("/edit/:states/:country_dropdown/:id/state", function(req, res) {
    States.findByIdAndUpdate(req.params.id, { Country: req.params.country_dropdown, statename: req.params.states }, function(err, updated) {
        console.log(updated);
        return res.send(updated);
    })
});



router.post("/newcity/:city/:state_dropdown", function(req, res) {
    Cities.create({ cityname: req.params.city, States: req.params.state_dropdown }, function(err, newlyCreated) {
        console.log(newlyCreated);
        return res.send(newlyCreated);
    });
});


router.post("/delete/:id/city", function(req, res) {
    Cities.findByIdAndRemove(req.params.id, function(err, removed) {
        return res.send(removed);
    });
});




router.get("/getcity/:id", function(req, res) {
    async.parallel([
        function(callback) {
            Cities.findById(req.params.id,
                function(err, foundData) {
                    callback(err, foundData)
                });
        },
        function(callback) {
            States.find({}, function(err, foundData) {
                callback(err, foundData);
            });
        }
    ], (err, results) => {
        return res.send({
            Cities: results[0],
            States: results[1],

        });
    })

});


router.post("/edit/:city/:state_dropdown/:id/city", function(req, res) {
    Cities.findByIdAndUpdate(req.params.id, { cityname: req.params.city, States: req.params.state_dropdown }, function(err, updated) {
        console.log(updated);
        return res.send(updated);
    })
});


module.exports = router
