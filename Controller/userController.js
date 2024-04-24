const Token = require('../model/TokenModel')
const User = require('../model/UserModel')
const crypto = require('crypto')
const { sendEmail } = require('../utils/sendEmail')
const { url } = require('inspector')
const jwt = require('jsonwebtoken')

exports.addUser = async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    //checking user  if exist or not
    if (user) {
        return res.status(400).json({ error: 'User already exist. Create new one or login with different email' })

    }
    //create user
    let userToAdd = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        address: req.body.address,
        password: req.body.password
    })
    //generate token
    let token = new Token({
        token: crypto.randomBytes(24).toString('hex'),
        user: userToAdd._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: "token genertionf failed" })
    }
    //send token in email
    const url = `${process.env.REACT_APP_FRONTEND_URL}/confirm/${token.token}`
    sendEmail({
        from: "noreply@example.com",
        to: req.body.email,
        subject: "Email Verification",
        text: "click here to verify your accour" + url,
        html: `<a href='${url}'><button>verify</button></a>`
    })
    //add user
    userToAdd = await userToAdd.save()
    if (!userToAdd) {
        return res.status(400).json({ error: "something went wrong" })
    }
    return res.send(userToAdd)
}

//email verification
exports.emailVerify = async (req, res) => {
    //check token
    const token = await Token.findOne({ token: req.params.token })
    if (!token) {
        return res.status(400).json({ error: "invalid token or may have expired" })
    }
    //check user
    let user = await User.findById(token.user)
    if (!user) {
        return res.status(400).json({ erro: "user not found " })
    }
    //check token verification
    if (user.isVerified) {
        return res.status(400).json({ error: "user already verified,login login to continue" })
    }
    //verify token
    user.isVerified = true
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: "something went wrong" })
    }
    return res.status(200).json({ message: "user verified successfully.Login to continue" })
}
//resend verificaton
exports.resendVerification= async(req,res)=>{
    //check user
    let user = await User.findOne({email:req.body.email})
    if(!user){
        res.status(400).json({error:"user not found"})
    }
    //email is verified or not
    if(user.isVerified){
        return res.status(400).json({error:"user already verified"})
    }
    //create token
    let token = new Token({
        token:crypto.randomBytes(24).toString('hex'),
        user:user._id
    })
    //save token
    token= await token.save()
    if(!token){
        return res.status(400).json({error:"token generaton failed"})
    }
    //send token in email
    const url = `${process.env.REACT_APP_FRONTEND_URL}/confirm/${token.token}`
    sendEmail({
        from: "noreply@example.com",
        to: req.body.email,
        subject: "Email Verification",
        text: "click here to verify your accour" + url,
        html: `<a href='${url}'><button>verify</button></a>`
    })
    return res.status(200).json({message:" verificaton link sent to email"})
}
//forget password
exports.forgetPassword = async (req, res) => {
    //check user
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "user not registered yet" })
    }
    //generate token
    let token = new Token({
        token: crypto.randomBytes(24).toString('hex'),
        user: user._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: "something went wrong" })
    }
    //send token in email
    // const url = `http://localhost:5000/api/resetpassword/${token.token}`
    const url = `${process.env.REACT_APP_FRONTEND_URL}/resetpassword/${token.token}`
    sendEmail({
        from: 'noreply@example.com',
        to: req.body.email,
        subject: 'forget password',
        text: 'click the button to reset your password' + url,
        html: `<a href='${url}'><button>reset password</button></a>`
    })
    return res.status(200).json({ message: "reset password sent successfully in your email" })

}
//reset password
exports.resetPassword = async (req, res) => {
    //generate token
    let token = await Token.findOne({ token: req.params.token })
    if (!token) {
        res.status(400).json({ error: "invalid token" })
    }
    //check user
    let user = await User.findOne(token.user)
    if (!user) {
        return res.status(400).json({ error: "user not registered yet" })
    }
    user.password = await req.body.password
    user = await user.save()
    if (!user) {
        res.status(400).json({ error: "something went wrong" })
    }
    return res.status(200).json({ message: "password changede successfully" })
}
//sign in
exports.SignIn = async (req, res) => {
    //check user's email
    try{
    const { email, password } = req.body
    let user = await User.findOne({ email: email })
    if (!user) {
        return res.status(400).json({ error: "user not found or invalid email" })
    }
    //check password
    if (!user.authenticate(password)) {
        return res.status(400).json({ error: "invalid password" })
    }
    //check if user verified or not
    if (!user.isVerified) {
        return res.status(400).json({ error: "user not verifies yet" })
    }
    //create login token
    let token = jwt.sign({ user: user._id, role: user.role,firstname:user.firstname,lastname:user.lastname,address:user.address }, process.env.JWT_SECRET)
    //set cookies
    res.cookie('myCookie', token, { expire: Date.now() + 86400 })
    //provide information to user
    const { _id, firstname, role,address,lastname} = user
    return res.status(200).json({ token, user: { _id,firstname, role, email,address,lastname } })
}
    catch (err) {
        // Handle any other errors that might occur during the sign-in process
        return res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
}

//sign out
exports.signOut = async (req, res) => {
    let response = await res.clearCookie('myCookie')
    if (!response) {
        return res.status(400).json({ error: "something went wrong" })
    }
    return res.status(200).json({ error: "logout successfully" })
}

//get all users
exports.getAllUsers = async (req,res)=>{
    let users = await User.find()
    if(!users){
        return res.status(400).json({error:"something went wrong"})
    }
    return res.send(users)
}
