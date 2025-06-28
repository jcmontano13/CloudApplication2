// import user.model
const User = require('../models/user.model');

// import auth.util
const authUtil = require('../util/authentication');

// import validation module
const validation = require('../util/validation');

// import session flash
const sessionFlash = require('../util/session-flash');
const session = require('express-session');

function getSignup(req, res) {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            email: '',
            confirmEmail: '',
            password: '',
            fullname: '',
            street: '',
            posta: '',
            city: '',
        };
    }

    res.render('customer/auth/signup',{ inputData: sessionData}) // render template, parse, replace dynamic part, sent to guest for response
}

// function when the user is created
async function signup(req, res, next) {
    const enteredData = {
        email: req.body.email,
        confirmEmail: req.body['confirm-email'],
        password: req.body.password,
        fullname: req.body.fullname,
        street: req.body.street,
        postal: req.body.postal,
        city: req.body.city
    }
    if (!validation.userDetailsAreValid(
            req.body.email, 
            req.body.password, 
            req.body.fullname, 
            req.body.street,
            req.body.postal,
            req.body.city
        ) || !validation.emailIsConfirmed(req.body.email, req.body['confirm-email'])
    ) {
        sessionFlash.flashDataToSession(req, {
            errorMessage: 'Please check your input, Password must be at least 6 characters long, postal muste be 5 characters long.',
            ...enteredData
        }, 
        function(){
            res.redirect('/signup');
        })
        return;
    }

    const user = new User(
        req.body.email,
        req.body.password,
        req.body.fullname,
        req.body.street,
        req.body.postal,
        req.body.city
    );

    try {
        const existsAlready = await user.existsAlready();

        if (existsAlready) {
            sessionFlash.flashDataToSession(req, {
                errorMessage: 'User exists already! try logging in instead!',
                ...enteredData,
            }, 
            function(){
                res.redirect('/signup');
            });
            return;
        }
        await user.signup(); // store request into db
        
    } catch(error) {
        next(error);
        return;
    }
    
    res.redirect('/login'); // redirect to login after the user was created
}

function getLogin(req, res) {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            email: '',
            password: ''
        };
    };
    res.render('customer/auth/login', { inputData: sessionData });
}

async function login(req, res, next) {
    const user = new User(req.body.email, req.body.password);
    let existingUser;
    try {
        existingUser = await user.getUserWithSameEmail();
    } catch(error) {
        next(error);
        return;
    }

    const sessionErrorData = {
        errorMessage: 'Invalid credentials - please double-check your email and password!',
        email: user.email,
        password: user.password
    };
    
    // email not found
    if (!existingUser) {
        sessionFlash.flashDataToSession(req, sessionErrorData , function() {
            res.redirect('/login');
        });
        return;
    }

    const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);

    if (!passwordIsCorrect) {
        sessionFlash.flashDataToSession(req, sessionErrorData , function() {
            res.redirect('/login');
        });
        return;
    }

    authUtil.createUserSession(req, existingUser, function() {
        res.redirect('/');
    });
    
}

function logout(req, res) {
    authUtil.destroyUserAuthSession(req);
    res.redirect('/login');
}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup,
    login: login,
    logout: logout
}