const Token = require('../model/TokenModel')
const User = require('../model/UserModel')
const crypto = require('crypto')

exports.addUser= async (req,res)=>{
    let user = await User.findOne({email:req.body.email})
    //checking user  if exist or not
    if (user){
        res.status(400).json({error:'User already exist. Creare new one or login with different email'})

    }
    //create user
    let userToAdd = new User ({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        address:req.body.address,
        password:req.body.password
    })
    //generate token
    let token = new Token({
        token: crypto.randomBytes(24).toString('hex'),
        user:userToAdd._id
    })
    token = await token.save()
    if(!token){
        res.status(400).json({error:"token genertionf failed"})
    }
    //send token in email
    //add user
    userToAdd = await userToAdd.save()
    if(!userToAdd){
        res.status(400).json({error:"something went wrong"})
    }
    res.send(userToAdd)
}