const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
require('dotenv').config()

//create req handler for both author and user
const createUserOrAuthor=async(req,res)=>{
    //get users or author collection object
    const userCollectionObj=req.app.get('userCollection')
    const authorCollectionObj=req.app.get('authorCollection')

    //get user or author
    const user=req.body
    user.blockStatus=false;
    //check duplicate user
    if(user.userType=='user'){
        //find user by username
        let userObj=await userCollectionObj.findOne({username:user.username})
        //if user existed
        if(userObj!=null){
           return res.send({message:"user already existed"})
        }

    }
    //check duplicate author
    if(user.userType=='author'){
        //find author by username
        let authorObj= await authorCollectionObj.findOne({username:user.username})

        //check if author exists
        if(authorObj!=null){
          return  res.send({message:"Author already existed"})
        }
    }
    //hash password
    const hashedpass=await bcryptjs.hash(user.password,7);
    //replace pass with hashed pass
    user.password=hashedpass
    //save user
    if(user.userType=='user'){
       await userCollectionObj.insertOne(user);
       res.send({message:"user created",user:user});
    }
    if(user.userType=='author'){
        await authorCollectionObj.insertOne(user);
        res.send({message:"author created"})
    }
    

}

//user or author LOGIN or ADMIN LOGIN   
const userOrAuthorLogin=async (req,res)=>{

    const userCollectionObj=req.app.get('userCollection')
    const authorCollectionObj=req.app.get('authorCollection')
    const adminCollectionObj=req.app.get('adminCollection')

    //get user by body
    const user= req.body;

    //verify username of user
    if(user.userType=='user'){
        const userObj=await userCollectionObj.findOne({username:user.username})

        if(userObj==null){
            return res.send({message:"INVALID USERNAME"})
        }
        if(userObj.blockStatus==true){
            return res.send({message:"You have been banned from the site"})
        }
        else{
            
            let status=await bcryptjs.compare(user.password,userObj.password);
            if(status==false){
                return res.send({message:"Password is invalid"})
            }else{
                //if username and password are both valid
                const signedToken=jwt.sign({username:userObj.username},process.env.SECRET_KEY,{expiresIn:'1d'})
                delete userObj.password;
                res.send({message:"Login success",token:signedToken,user:userObj})
            }
        }

    }
    //verify username of author
    if(user.userType=='author'){
        const authorObj=await authorCollectionObj.findOne({username:user.username})

        if(authorObj==null){
            return res.send({message:"INVALID AUTHOR CRED"})
        }
        if(authorObj.blockStatus==true){
            return res.send({message:"You have been banned from the site"})
        }
        else{
            let status= await bcryptjs.compare(user.password,authorObj.password);
            console.log(status);
            if(status==false){
                return res.send({message:"Password is Invalid"});
            }else{
                //if username and password are both valid
                const signedToken=jwt.sign({username:authorObj.username},process.env.SECRET_KEY,{expiresIn:'1d'})
                delete authorObj.password;
                res.send({message:"Login success",token:signedToken,user:authorObj})
            }
        }
    }
    //verify username of admin
    if(user.userType=='admin'){
        const adminObj=await adminCollectionObj.findOne({username:user.username});

        if(adminObj==null){
            res.send({message:"INVALID ADMIN CREDENTIALS"});
        }else{
                const signedToken=jwt.sign({username:adminObj.username},process.env.SECRET_KEY,{expiresIn:'1d'});
                delete adminObj.password;
                res.send({message:"Login success",token:signedToken,user:adminObj});
        }
    }
    
    

}


module.exports={createUserOrAuthor,userOrAuthorLogin}
