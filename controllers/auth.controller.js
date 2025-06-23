// import user.model
const User = require('../models/user.model');

function getSignup(req, res) {
    res.render('customer/auth/signup') // render template, parse, replace dynamic part, sent to guest for response
}

// function when the user is created
async function signup(req, res) {
    const user = new User(
        req.body.email,
        req.body.password,
        req.body.fullname,
        req.body.street,
        req.body.postal,
        req.body.city
    );

    await user.signup(); // store request into db

    res.redirect('/login'); // redirect to login after the user was created
}

function getLogin(req, res) {
    res.render('customer/auth/login');
}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup

}