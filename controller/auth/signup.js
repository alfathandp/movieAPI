const {User} = require('../../models')
const createError = require('http-errors');

const postSignup = (req,res,next) => {
  const validation = User.validate(req.body);
  if (validation.error) {
    const error = new Error(validation.error.message);
    error.statusCode = 400;
    return next(error);
  }

  //chech existance
  const user = new User(req.body);
  user.checkExistence()
    .then(result => {
      if (result.check) {
        const error = new Error(result.message)
        error.statusCode = 409;
        return next(error);
      }

      user.save((error) => {
        if(error) {
          return next(createError(500));
        }

        res.status(201).json({
          message:'user berhasil ditambahkan'
        })
      })
    })
    .catch(err => next(createError(500)));
};

module.exports = {postSignup};
