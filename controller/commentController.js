const {ObjectId} = require('bson');
const createError = require('http-errors');
const {Comment} = require('../models');
const {dbConnect} = require('../configurations');

const postComment = (req,res,next) => {
  if (!ObjectId.isValid(req.params.movieId)) {
    return next(createError(400));
  }

  const error = Comment.validate(req.body['text']);
  if(error) {
    return next(error);
  };

  const commentData = {text: req.body['text']};
  commentData.userId = new ObjectId(req.user['_id']);
  commentData.username = req.user['username'];
  commentData.movieId = new ObjectId(req.params['movieId']);

  const comment = new Comment(commentData);

  comment.save()
    .then(() => {
        res.status(201).json({
          message:'the comment has been successfully created'
        })
    })
    .catch(err => {
    next(createError(500));
    console.error(err);
  });
};

const putComment = (req, res, next) => {
  if (!ObjectId.isValid(req.params.commentId)) {
    return next(createError(400));
  }

  const commentId = new ObjectId(req.params.commentId);

  const error = Comment.validate(req.body['text']);
  if(error) {
    return next(error);
  };

  Comment.edit(commentId, req.body['text'])
    .then(() => {
      res.json({
        message:'comment edited'
      });
    })
    .catch (err => next(createError(500)));
};

const deleteComment = (req, res, next) => {
    if (!ObjectId.isValid(req.params.commentId)) {
        return next(createError(400));
      }
      const commentId = new ObjectId(req.params.commentId);

    Comment.delete(commentId)
    .then(() => {
      res.json({
        message:'comment deleted'
      });
    })
    .catch (err => next(createError(500)));
};

const getComment = (req,res,next) => {
  if (!ObjectId.isValid(req.params.movieId)) {
    return next(createError(400));
  } 

  const movieId = new ObjectId(req.params.movieId);
  console.log(movieId);
  const pageNum = parseInt(req.params.page);
  console.log(pageNum);
  if(isNaN(pageNum)) {
    return next(createError(400));
  }
  const commentsToSkip = pageNum * 10;

  dbConnect('comments', async (db) => {
    try {
      const comments = await db
       .find({movieId})
       .sort({createdAt: -1})
       .skip(commentsToSkip)
       .limit(10) 
       .toArray();  
       res.json(comments);
    } catch (err) {
      next(createError(500));
    }
  });
};



module.exports = {
    postComment,
    putComment,
    deleteComment,
    getComment
};