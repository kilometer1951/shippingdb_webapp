const router = require("express").Router();
const Clients = require("../models/client");
const Countries = require("../models/country");
const Consignees = require("../models/consignee");
const async = require('async');




//CONSIGNEE
router.get('/consignee', function(req, res) {
    if (req.user) {
        //get clients
        Consignees.find({}, function(err, foundData) {
            return res.render("main/consignee", { title: 'Oldsailor Ocean Shipping LLC || Consignee', data: foundData });
        });
    }
    else {
        return res.redirect('/login');
    }
});


//get clients if no search ajax call
router.get("/consigneeAjax", function(req, res) {
    Consignees.find({}, function(err, foundData) {
        return res.send(foundData);
    });
});


//cosignee per client
router.get("/cosigneeDropdownData/:id", function(req, res) {
    Consignees.find({ Client: req.params.id })
        .populate('Client')
        .sort("-_id")
        .exec(function(err, foundData) {
            return res.send(foundData);
        });
});


//get clients if no search ajax call
router.post("/consignees/searchQ", function(req, res) {

    Consignees.find({
        $or: [
            { pnum: { $regex: new RegExp(req.body.data, "i") } },
            { email: { $regex: new RegExp(req.body.data, "i") } },
            { full_name: { $regex: new RegExp(req.body.data, "i") } },
            { first_name: { $regex: new RegExp(req.body.data, "i") } },
            { last_name: { $regex: new RegExp(req.body.data, "i") } }
        ]

    }, function(err, foundData) {

        return res.send(foundData);
    });
})


//get countries data and clients data

router.get("/displayDropdowndataForConsignee", function(req, res) {
    async.parallel([
        function(callback) {
            Countries.find({}, function(err, foundData) {
                callback(err, foundData)
            });
        },

        function(callback) {
            //states
            Clients.find({}, function(err, foundData) {
                callback(err, foundData);
            });
        }
    ], (err, results) => {
        var countries = results[0];
        var clients = results[1];
        console.log(countries);
        return res.send({
            countries: countries,
            clients: clients
        });
    });

});

//save client
router.post("/consignee/new", function(req, res) {
    //console.log(req.body);
    var cfirst_name = req.body.data.cfirst_name;
    var clast_name = req.body.data.clast_name;
    var cfull_name = req.body.data.cfirst_name;
    var cpnum = req.body.data.cpnum;
    var cemail = req.body.data.cemail;
    var address = req.body.data.address;
    var state = req.body.data.state;
    var city = req.body.data.city;
    var postalcode = req.body.data.postalcode;
    var careof = req.body.data.careof;
    var country = req.body.data.country;
    var client = req.body.data.client;

    var newData = {
        first_name: cfirst_name,
        last_name: clast_name,
        full_name: cfull_name,
        pnum: cpnum,
        email: cemail,
        address: address,
        city: city,
        state: state,
        postalcode: postalcode,
        careof: careof,
        Country: country,
        Client: client
    };
    //console.log(req.body.data.cfirst_name)
    Consignees.create(newData, function(err, newlyCreated) {
        return res.send(newlyCreated);
    });

});



//Edit client
router.put("/consignees/:id/edit", function(req, res) {
    //console.log(req.body);
    var cfirst_name = req.body.data.cfirst_name;
    var clast_name = req.body.data.clast_name;
    var cfull_name = req.body.data.cfirst_name;
    var cpnum = req.body.data.cpnum;
    var cemail = req.body.data.cemail;
    var address = req.body.data.address;
    var state = req.body.data.state;
    var city = req.body.data.city;
    var postalcode = req.body.data.postalcode;
    var careof = req.body.data.careof;
    var country = req.body.data.country;
    var client = req.body.data.client;

    var editedData = {
        first_name: cfirst_name,
        last_name: clast_name,
        full_name: cfull_name,
        pnum: cpnum,
        email: cemail,
        address: address,
        city: city,
        state: state,
        postalcode: postalcode,
        careof: careof,
        Country: country,
        Client: client
    };

    console.log(req.body)
    // res.send(editedData);
    Consignees.findByIdAndUpdate(req.params.id, editedData, function(err, updateRecord) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(updateRecord);
        }
    });

});


//delete client
router.delete("/consignees/:id/delete", function(req, res) {
    Consignees.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            return console.log(err);
        else
            return res.send(req.params.id);
    })

});


//search clients



//get modal data before editing
router.get("/openEditModal_Consignees/:id", function(req, res) {
    async.parallel([
        function(callback) {
            Consignees
                .findOne({ _id: req.params.id })
                .populate("Country")
                .populate("Client")
                .exec(function(err, foundData) {
                    callback(err, foundData)
                });
        },

        function(callback) {
            //states
            Clients.find({}, function(err, foundData) {
                callback(err, foundData);
            });
        },
        function(callback) {
            //states
            Countries.find({}, function(err, foundData) {
                callback(err, foundData);
            });
        }
    ], (err, results) => {
        var foundData = results[0];
        var client = results[1];
        var country = results[2];
        return res.send({
            foundData: foundData,
            client: client,
            country: country
        });
    });

});





module.exports = router
