const router = require("express").Router();



router.get('/nextpage', function(req, res) {
   
    if(req.user) {
       return res.render("main/nextPage", { title: 'Oldsailor Ocean Shipping LLC', layout:false});
    } else {
        return res.redirect('/login');
    }
});




module.exports = router