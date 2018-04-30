const Company = require("../models/companydetails");
const States = require("../models/state");
const Cities = require("../models/city");
const router = require("express").Router();
const async = require('async');

//image upload

var multer = require('multer');
var storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

var imageFilter = function(req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter })

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dtfyfl4kz',
    api_key: '223622844967433',
    api_secret: 'r20BlHgHcoH8h-EznEJPQmG6sZ0'
});



router.get('/', function(req, res) {

    if (req.user) {

        return res.render("main/index", { title: 'Oldsailor Ocean Shipping LLC || Home' });
    }
    else {
        return res.redirect('/login');
    }
});

router.get('/companyContent', function(req, res) {
    async.parallel([
        function(callback) {
            Company
                .find({})
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


//upload data to feed
router.post('/companydetails_upload', upload.single('filename_1'), function(req, res) {
    if (req.file) {

        cloudinary.uploader.upload(req.file.path, function(result) {

            //save image to db
            var photo = result.secure_url
            var fmcotino = req.body.fmcotino;
            var companyname = req.body.companyname;
            var address = req.body.address;
            var state = req.body.state;
            var city = req.body.city;
            var zipcode = req.body.zipcode;
            var phonenumber = req.body.phonenumber;
            var email = req.body.email;
            var fax = req.body.fax;

            //check if there is data 
            Company.find({})
                .populate("State")
                .populate("City")
                .exec(function(err, data) {
                    if (data.length === 0) {
                        //create
                        var newData = { photo, fmcotino, companyname, address, State: state, City: city, zipcode, phonenumber, email, fax, hasEnteredDetails: true };
                        Company.create(newData, function(err, newlyCreated) {
                            if (err)
                                return console.log(err);
                            else
                                console.log(newlyCreated);
                            res.redirect("/admin/index")
                        });
                    }
                    else {
                        //update
                        // console.log("update")
                        var fmcotino = req.body.fmcotino1;
                        var companyname = req.body.companyname1;
                        var address = req.body.address1;
                        var state = req.body.state1;
                        var city = req.body.city1;
                        var zipcode = req.body.zipcode1;
                        var phonenumber = req.body.phonenumber1;
                        var email = req.body.email1;
                        var fax = req.body.fax1;
                        var edited = { photo, fmcotino, companyname, address, State: state, City: city, zipcode, phonenumber, email, fax };
                        Company.findByIdAndUpdate(req.body.id, edited, function(err, updated) {
                            console.log("updated");
                            res.redirect("/admin/index");
                        });

                    }
                });




        });
    }
    else {
        //   console.log(req.body.state)
        //save image to db
        var fmcotino = req.body.fmcotino;
        var companyname = req.body.companyname;
        var address = req.body.address;
        var state = req.body.state;
        var city = req.body.city;
        var zipcode = req.body.zipcode;
        var phonenumber = req.body.phonenumber;
        var email = req.body.email;
        var fax = req.body.fax;

        Company.find({})
            .populate("State")
            .populate("City")
            .exec(function(err, data) {
                if (data.length === 0) {
                    //create
                    var newData = { fmcotino, companyname, address, State: state, City: city, zipcode, phonenumber, email, fax, hasEnteredDetails: true };
                    Company.create(newData, function(err, newlyCreated) {
                        if (err)
                            return console.log(err);
                        else
                            console.log(newlyCreated);
                        res.redirect("/admin/index")
                    });
                }
                else {
                    //update
                    //update
                    // console.log("update")
                    var fmcotino = req.body.fmcotino1;
                    var companyname = req.body.companyname1;
                    var address = req.body.address1;
                    var state = req.body.state1;
                    var city = req.body.city1;
                    var zipcode = req.body.zipcode1;
                    var phonenumber = req.body.phonenumber1;
                    var email = req.body.email1;
                    var fax = req.body.fax1;
                    var edited = { fmcotino, companyname, address, State: state, City: city, zipcode, phonenumber, email, fax };
                    Company.findByIdAndUpdate(req.body.id, edited, function(err, updated) {
                        console.log("updated");
                        res.redirect("/admin/index");
                    });
                }
            });




    }

});


//contries

module.exports = router
