// create express app
const exp = require('express')
const app=exp();
const path=require('path')
require('dotenv').config() //importing env

//add body parser middleware
app.use(exp.json())

//JOIN FRONTEND AND BACKEND
app.use(exp.static(path.join(__dirname,'../frontend/build')))

const mongoClient=require('mongodb').MongoClient;
//connect to DB
mongoClient.connect(process.env.DB_URL)
.then(client=>{
    //get the database obj
    const dbObj=client.db('blogappdb')
    //import collection objects from db
    const userCollectionObj=dbObj.collection('users');
    const authorsCollectionObj=dbObj.collection('authors');
    const articlesCollectionObj=dbObj.collection('articles');
    const adminCollectionObj=dbObj.collection('admin');

    //share it with apis
    app.set('userCollection',userCollectionObj)
    app.set('authorCollection',authorsCollectionObj)
    app.set('articlesCollection',articlesCollectionObj)
    app.set('adminCollection',adminCollectionObj)


    console.log("CONNECTION TO DATABASE SUCCESSFUL")

})
.catch(err=>{
    console.log(err);
})

//import apis
const userApp=require('./APIs/user-api')
const authorApp=require('./APIs/author-api')
const adminApp=require('./APIs/admin-api')

//handover the request to specific APIs
app.use('/user-api',userApp)
app.use('/author-api',authorApp)
app.use('/admin-api',adminApp)


//error handling middleware
app.use((err,req,res,next)=>{
    res.send({status:"error",message:err.message})
})

//get port number from env
const port= process.env.PORT || 4000; //port number if available it will be assidned or we assign it again as an OR (||)

//assign port number
app.listen(port,()=>console.log(`http server started at port ${port}`))