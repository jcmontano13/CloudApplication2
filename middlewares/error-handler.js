function handleErrors(error, req, res, next) { // call whenever an error encountered
    console.log(error);

    if (error.code === 404) {
        return res.status(404).render('shared/404');
    }
    res.status(500).render('shared/500'); // 500 server side error
}

module.exports = handleErrors;