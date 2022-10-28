const Joi = require('@hapi/joi');
const {dbConnect} = require('../configurations');

class Comment {
  constructor(commentData) {
    this.commentData = commentData;
    this.commentData.CreatedAt = new Date();
    this.commentData.modifiedAt = new Date();
  }

  static validate(commentText) {
    const validation = Joi.string().max(300).validate(commentText);
    if(validation.error) {
      const error = new Error(validation.error.message);
      error.statusCode = 400;
      return error;
    };

    return null;
  }

  save() {
    return new Promise((res,rej) => {
      dbConnect('comments', async(db,db2) => {
        try {
          const comment = await db.insertOne(this.commentData);
          this.commentData['id'] = comment.insertedId;
          await db2.updateOne({_id: this.commentData['movieId']}, {
            '$push': {
                comments: {
                  '$each': [{_id: this.commentData['id'] , username: this.commentData['username'], text: this.commentData['text']}],
                  '$slice': -10
                }
            }
          });
          res();
        } catch (err) {
            rej(err);
        }
      }, 'movies');
    })
  }

  static edit(commentId, text) {
    return new Promise((res, rej) => {
        dbConnect('comments', async (db) => {
          try{
            await db.updateOne({_id: commentId}, {'$set':{text},
            '$currentDate': {modifiedAt: true} });
            res();
          } catch (err) {
            rej (err);
          }
        })
    })
  }

  static delete(commentId) {
    return new Promise((resolve, reject) => {
        dbConnect('comments', async (db) => {
            try{
              await db.deleteOne({_id: commentId});
              resolve();
            } catch (err) {
              reject(err);

            }
        })
    })
  }
}
module.exports = Comment;
