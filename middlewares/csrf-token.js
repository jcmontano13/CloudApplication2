function addCsrfToken(req, res, next) {
    res.locals.csrfToken = req.csrfToken(); // generate a valid token
    next(); // forward to next middleware inline
}

module.exports = addCsrfToken;