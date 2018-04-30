const router = require("express").Router();
const Clients = require("../models/client");
const States = require("../models/state");
const Cities = require("../models/city");
const async = require('async');
const moment = require('moment');



router.get('/clients', function(req, res) {
    if (req.user) {
        var t = req.cookies;
        // t.req.cookies['connect.sid'].split('.')[1]
        //   console.log(t['connect.sid'])
        //get clients
        Clients.find({}, function(err, foundData) {
            return res.render("main/clients", { title: 'Oldsailor Ocean Shipping LLC || Clients', data: foundData });
        });
    }
    else {
        return res.redirect('/login');
    }
});


//get clients based on id
router.get("/clientsBasedId/:id", function(req, res) {
    Clients.findOne({ _id: req.params.id }, function(err, foundData) {
        // console.log(foundData);
        return res.send(foundData);
    });
});


//get clients if no search ajax call
router.get("/clientsAjax", function(req, res) {
    Clients
        .find({})
        .sort("-_id")
        .exec(function(err, foundData) {
            return res.send(foundData);
        });
});


//get clients if no search ajax call
router.post("/clients/searchQ", function(req, res) {
    // console.log(req.body.data);
    //   Clients.aggregate([
    //         { $match : { first_name : req.body.data } }
    //       ], function(err, results){
    //           return res.send(results);
    //       });
    Clients.find({
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


//get states data

router.get('/states', function(req, res) {
    //get states
    States.find({}, function(err, foundData) {
        return res.send(foundData);
    });
});

//get cities data

router.get('/cities/:id', function(req, res) {
    //get states
    Cities.find({ States: req.params.id }, function(err, foundData) {
        return res.send(foundData);
    });
});


//save client
router.post("/client/new", function(req, res) {
    var state = '';
    var city = '';
    if (req.body.data.state !== "Select a state") {
        state = req.body.data.state;


    }
    else {
        state = undefined;
    }


    if (req.body.data.city !== "Select a city") {
        city = req.body.data.city;
        //console.log(city);
    }
    else {
        city = undefined;
    }



    //console.log(req.body);
    var cfirst_name = req.body.data.cfirst_name;
    var clast_name = req.body.data.clast_name;
    var cfull_name = req.body.data.clast_name + ', ' + req.body.data.cfirst_name;
    var cpnum = req.body.data.cpnum;
    var cemail = req.body.data.cemail;
    var address = req.body.data.address;
    var state = state;
    var city = city;
    var zipcode = req.body.data.zipcode;
    var tax = req.body.data.tax;
    var passport = req.body.data.passport;
    var fax = req.body.data.fax;
    var ssn = req.body.data.ssn;
    var date = new Date();

    var newData = {
        first_name: cfirst_name,
        last_name: clast_name,
        full_name: cfull_name,
        pnum: cpnum,
        email: cemail,
        address: address,
        City: city,
        State: state,
        zipcode: zipcode,
        tax: tax,
        passport: passport,
        fax: fax,
        ssn: ssn,
        createdAt: moment.parseZone(date).format('l')
    }; //
    //console.log(req.body.data.cfirst_name)
    Clients.create(newData, function(err, newlyCreated) {
        Clients.find({ createdAt: moment.parseZone(newlyCreated.createdAt).format('l') }, function(err, i) {

        })
        //  console.log(moment.parseZone(newlyCreated.createdAt).format('l'));
        return res.send(newlyCreated);
    });

});



//Edit client
router.put("/client/:id/edit", function(req, res) {
    //console.log(req.body);
    var cfirst_name = req.body.data.cfirst_name;
    var clast_name = req.body.data.clast_name;
    var cfull_name = req.body.data.clast_name + ', ' + req.body.data.cfirst_name;
    var cpnum = req.body.data.cpnum;
    var cemail = req.body.data.cemail;
    var address = req.body.data.address;
    var state = req.body.data.state;
    var city = req.body.data.city;
    var zipcode = req.body.data.zipcode;
    var tax = req.body.data.tax;
    var passport = req.body.data.passport;
    var fax = req.body.data.fax;
    var ssn = req.body.data.ssn;

    var editedData = {
        first_name: cfirst_name,
        last_name: clast_name,
        full_name: cfull_name,
        pnum: cpnum,
        email: cemail,
        address: address,
        City: city,
        State: state,
        zipcode: zipcode,
        tax: tax,
        passport: passport,
        fax: fax,
        ssn: ssn
    };

    // console.log(req.body)
    // res.send(editedData);
    Clients.findByIdAndUpdate(req.params.id, editedData, function(err, updateRecord) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(updateRecord);
        }
    });

});


//delete client
router.delete("/client/:id/delete", function(req, res) {
    Clients.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            return console.log(err);
        else
            return res.send(req.params.id);
    })

});


//search clients



//get modal data before editing
router.get("/openEditModal/:id", function(req, res) {
    async.parallel([
        function(callback) {
            Clients
                .findOne({ _id: req.params.id })
                .populate("State")
                .populate("City")
                .exec(function(err, foundData) {
                    callback(err, foundData)
                });
        },

        function(callback) {
            //states
            States.find({}, function(err, foundData) {
                callback(err, foundData);
            });
        }
    ], (err, results) => {
        var foundData = results[0];
        var states = results[1];
        return res.send({
            foundData: foundData,
            states: states
        });
    });

});





module.exports = router
