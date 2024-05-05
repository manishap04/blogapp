const exp=require('express')
const adminApp=exp.Router()
const {userOrAuthorLogin}=require('./Util')
const expressAsyncHandler=require('express-async-handler')


//MIDDLEWARE TO GET ADMIN COLLECITON GLOBALLY
let adminCollectionObj,authorCollectionObj,userCollectionObj,articleCollectionObj;
adminApp.use((req,res,next)=>{
    adminCollectionObj=req.app.get('adminCollection')
    authorCollectionObj=req.app.get('authorCollection')
    userCollectionObj=req.app.get('userCollection')
    articleCollectionObj=req.app.get('articlesCollection')
    next();
})


//ADMIN LOGIN
adminApp.post('/login',expressAsyncHandler(userOrAuthorLogin));

//ADMIN READ USER AND AUTHOR LIST
adminApp.get('/user-list',async(req,res)=>{
    let userList=await userCollectionObj.find({}).toArray();
    res.send({message:"users list",payload:userList})

})
//ADMIN READ AUTHOR LIST
adminApp.get('/author-list',async(req,res)=>{
    let authorList=await authorCollectionObj.find({}).toArray();
    res.send({message:"author list",payload:authorList})
})
//GET ARTICLES BY AUTHOR NAME
adminApp.get('/article-of-author/:username',async(req,res)=>{
    let usernameFromUrl=req.params.username
    let articleList=await articleCollectionObj.find({username:usernameFromUrl}).toArray();
    return res.send({message:'articles of author',payload:articleList})
})
//BLOCK AUTHOR
adminApp.put('/author-list/:username',async(req,res)=>{
    let author=req.body;
    let authorName=req.params.username;

    const authorObj=await authorCollectionObj.findOne({username:author.username})
    
    if(authorObj.blockStatus==false){
        let result=await authorCollectionObj.findOneAndUpdate({username:authorName},{$set:{blockStatus:true}})
        return res.send({message:"author blocked"});
    }
    if(authorObj.blockStatus==true){
        let result=await authorCollectionObj.findOneAndUpdate({username:authorName},{$set:{blockStatus:false}})
        return res.send({message:"author unblocked"});
    }
})
//BLOCK USER
adminApp.put('/user-list/:username',async(req,res)=>{
    let user=req.body;
    let userName=req.params.username;

    const userObj=await userCollectionObj.findOne({username:user.username})
    
    if(userObj.blockStatus==false){
        let result=await userCollectionObj.findOneAndUpdate({username:userName},{$set:{blockStatus:true}})
        return res.send({message:"user blocked"});
    }
    if(userObj.blockStatus==true){
        let result=await userCollectionObj.findOneAndUpdate({username:userName},{$set:{blockStatus:false}})
        return res.send({message:"user unblocked"});
    }
})

adminApp.get('/test-admin',(req,res)=>{
    res.send({message:"RESPOSE FROM ADMIN APP"})
})

module.exports=adminApp