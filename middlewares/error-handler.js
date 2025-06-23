function handleErrors(error, req, res, next) { // call whenever an error encountered
    console.log(error);
    res.status(500).render('shared/500'); // 500 server side error
}

module.exports = handleErrors;