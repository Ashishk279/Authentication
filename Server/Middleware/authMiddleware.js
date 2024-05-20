const jwt = require('jsonwebtoken');
const User  = require('../models/User')
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
console.log("====", token);
    // Check json web token exists & is verified
    if (token) {
        jwt.verify(token, 'secret jwt', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login')
                // res.status(400).send("Login again")
            } else {
                console.log(decodedToken);
            
                next();
            }
        });
    } else {
        res.redirect('/login')
        // res.status(400).send("Login again")
    }
}

const check_User =  (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'secret jwt', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    }
}
module.exports = { requireAuth, check_User}