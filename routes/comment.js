const {Router} = require('express');
const {postComment, putComment, deleteComment, getComment} = require('../controller');
const { auth } = require('../middlewares');

const router = Router();

router
  .post('/createComment/:movieId', auth, postComment)
  .put('/editComment/:commentId', auth, putComment)
  .delete('/deleteComment/:commentId', auth, deleteComment)
  .get('/getComment/:movieId/:page', auth, getComment)


  module.exports = router;
