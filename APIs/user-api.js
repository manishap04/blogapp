const exp=require('express')
const userApp=exp.Router()
const {createUserOrAuthor,userOrAuthorLogin} = require('./Util')
const expressAsyncHandler=require('express-async-handler');
const verifyToken=require('../Middlewares/verifyToken');


//middleware to get the articles collection object globally
let articlesCollectionObj;
userApp.use((req,res,next)=>{
    articlesCollectionObj=req.app.get('articlesCollection')
    next();
})

//routes
//registration
userApp.post('/user',expressAsyncHandler(createUserOrAuthor))
//login
userApp.post('/login',expressAsyncHandler(userOrAuthorLogin))
//read articles
userApp.get('/articles',verifyToken,expressAsyncHandler(async(req,res)=>{
    const articlesList=await articlesCollectionObj.find({status:true}).toArray();
    res.send({message:"ALL ARTICLES",payload:articlesList});
}))
//COMMENT ON ARTICLES
userApp.post('/comment/:articleId',verifyToken,expressAsyncHandler(async(req,res)=>{

    const articleIdFromURL=(+req.params.articleId);
    const userComment=req.body;
    await articlesCollectionObj.updateOne({articleId:articleIdFromURL},{$addToSet:{comments:userComment}})
    res.send({message:"comment added"});

}))
module.exports=userApp
