const {dbConnect} = require('../configurations')
const {ObjectId} = require('bson');
const createError = require('http-errors');

const getMovies = (req,res,next) => {
  console.log(req.user);
  const pageNum = parseInt(req.params.page);
  if(isNaN(pageNum)) {
    return next(createError(400));
  }

  const moviesToSkip = (pageNum - 1)*10;

  dbConnect('movies', async(db) => {
    try{
    const movie = await db.find({}).skip(moviesToSkip).limit(10).toArray();
    res.json(movie);
    } catch (err) {
      next(createError(500));
    }
  });
};


const getOneMovie = (req,res,next) => {
  if(!ObjectId.isValid(req.params.id)) { //mengecek apakah id valid atau tidak
    return next(createError(400));
  }
  const newId = new ObjectId(req.params.id);
  dbConnect('movies', async (db) => {
    try{
    const movie = await db.findOne({_id: newId}); //findOne untuk mencari satu sesuai id
    if(!movie) {
        return next(createError(400));
    }
    res.json(movie);
    } catch (err) {
      return next(createError(500));
    }
  });
}


module.exports = {getMovies, getOneMovie};
