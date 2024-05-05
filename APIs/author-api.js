const exp=require('express')
const authorApp=exp.Router();
const expressAsyncHandler=require('express-async-handler')
const {createUserOrAuthor,userOrAuthorLogin}=require('./Util')
const verifyToken=require('../Middlewares/verifyToken');


//middleware such that we can declare author colleciton obj globally
let authorCollectionObj,articlesCollectionObj;
authorApp.use((req,res,next)=>{
    authorCollectionObj=req.app.get('authorCollection');
    articlesCollectionObj=req.app.get('articlesCollection');
    next();
})

//routes
//registration
authorApp.post('/user',expressAsyncHandler(createUserOrAuthor))
//login
authorApp.post('/login',expressAsyncHandler(userOrAuthorLogin))
//add new articles
authorApp.post('/new-article',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get new article from client
    const newArticle=req.body
    //insert into collection
    await articlesCollectionObj.insertOne(newArticle);
    //send response
    res.send({message:"NEW ARTICLE ADDED"});
    
}))
//read articles by authors username
authorApp.get('/articles/:username',verifyToken,expressAsyncHandler(async(req,res)=>{
    let authorName=req.params.username;
    let articles=await articlesCollectionObj.find({username:authorName}).toArray()
    res.send({message:"YOUR ARTICLES ARE",payload:articles})
}))
//edit articles by author
authorApp.put('/article',verifyToken,expressAsyncHandler(async(req,res)=>{
    const editedArticle=req.body;
    //this method will update the article and also return the latest state of the article
    let LatestArticle= await articlesCollectionObj.findOneAndUpdate({articleId:editedArticle.articleId},{$set:{...editedArticle}},{returnDocument:'after'})
    res.send({message:"Article edited",payload:LatestArticle})
}))
//DELETE ARTICLE (SOFT DELETE) (WE WILL JUST SET THE STATUS AS FALSE AND HIDE THE ARTICLE FROM AUTHOR)
authorApp.put('/article/:articleId',verifyToken,expressAsyncHandler(async(req,res)=>{
    let articleIdFromUrl=Number(req.params.articleId)
    let article=req.body;
    if(article.status==true){
    let result = await articlesCollectionObj.updateOne({articleId:articleIdFromUrl},{$set:{status:false}})
    if(result.modifiedCount==1){
        res.send({message:"Article deleted"})
    }
    }
    if(article.status==false){
        let result=await articlesCollectionObj.updateOne({articleId:articleIdFromUrl},{$set:{status:true}})
        if(result.modifiedCount==1){
            res.send({message:"Article restored"});
        }
    }

}))
module.exports=authorApp;