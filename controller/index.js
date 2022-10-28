const {postLogin} = require('./auth/login');
const {postSignup} = require('./auth/signup');
const {getMovies, getOneMovie} = require('./movieController');
const {postComment, putComment, deleteComment, getComment} = require ('./commentController');
module.exports = {
    postLogin,
    getMovies,
    getOneMovie,
    postSignup,
    postComment,
    putComment,
    deleteComment,
    getComment
}