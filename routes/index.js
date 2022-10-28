const authRouter = require('./auth');
const movieRouter = require('./movie');
const commentRouter = require('./comment');

module.exports = (app) => {
    app.use('/auth', authRouter);
    app.use(movieRouter);
    app.use(commentRouter);



 /*   app.get("/", (request,res, next) => {
        res.redirect('/user');
    });
    app.get('/user/:id/:paramId', (req, res, next) => {
        const host = req.get('Host')
        const {query,query2} = req.query;
        const {id, paramId} = req.params;
        console.log(host);
        console.log({query, query2});
        console.log({id, paramId}); 
        res.json(
            {
                message: "hai"
            }
        )
    });*/
};