const {User} = require('../../models');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const {readFileSync} = require('fs');

const postLogin = (req, res, next) => {

    User.login(req.body)
     .then(result => {
        if(result instanceof Error) {
            return next(result);
        }
        const secret = readFileSync('./private.key');
        //generate jwt token with .sign
        const token = jwt.sign(
          {
            _id: result._id,
            username: result.username
          },
          secret,
          {
            expiresIn:'24h'
          })
        
        res.json({token});
     })
     .catch(err => {
        next(createError(500));
     })
};

module.exports = {postLogin};
