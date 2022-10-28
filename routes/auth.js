const {Router} = require('express');
const {getLogin, postSignup, postLogin} = require('../controller');

const router = Router();

router
    //.get('/login',getLogin)
    .post('/login', postLogin)
   // .get('/login')
    .post('/signup', postSignup)

module.exports = router;