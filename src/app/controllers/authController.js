require('dotenv').config()

const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')
const router = express.Router();

function generateToken(params = {}){
    return jwt.sign({params}, process.env.JWT_SECRET, {
        expiresIn: 86400
    })
}

router.post('/register', async(req,res) => {
    
    

    try{
        const {email} = req.body
        if(await User.findOne({email})){
            return res.status(400).send({Error : '[register] : Email already exist'})
        }

        const user = await User.create(req.body)

        user.password = undefined;

        return res.send({user, token: generateToken({id: user.id})})

    }catch(err){
        return res.status(400).send({Error : '[register] : Registration Failed'})
    }
})

router.post('/authenticate', async (req,res) => {
    const {email, password} = req.body;
    
    const user = await User.findOne({email}).select('+password');

    console.log(email, password)

    if(!user){
        return res.status(404).send({Error: '[Authenticate] : User not found'})
    }

    if(!await bcrypt.compare(password, user.password)){
        return res.status(401).send({Error: '[Authenticate] : Invalid credentials'})
    }

    user.password = undefined

    res.send({user, token: generateToken({id: user.id})})
})

router.post('/forgot_password', async (req,res) => {

    const {email} = req.body
    
    try{

        const user = await User.findOne({email})

        if(!user){
            return res.status(404).send({Error: '[Authenticate] : User not found'})
        }

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set' : {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        })

        mailer.sendMail({
            to: email,
            from: 'bruno1pb13@gmail.com',
            template: 'auth/forgot_password',
            context: { token }
        }, (err) =>{
            if(err){
                console.log(err)
                return res.status(400).send({Error : 'Cannot send email'})
            }

            res.status(200).send({nextStep: 'We send an email with instructions to reset your password'})
        })

    }catch(err){
        res.status(500).send({Error : 'Cannot response your request now, try again latter => ' + err})
    }

})

router.post('/reset_password', async (req,res)=>{
    const {email, token, password} = req.body;

    try{

        const user = await User.findOne({email})
            .select('+passwordResetToken passwordResetExpires') 

        if(!user){
            return res.status(404).send({Error: '[Authenticate] : User not found'})
        }

        if(token !== user.passwordResetToken){
            return res.status(401).send({Error: '[Authenticate] : Token Invalid'})
        }

        const now = new Date()

        if(now > user.passwordResetExpires){
            return res.status(401).send({Error: '[Authenticate] : Token expired make a new request'})
        }

        user.password = password;
        user.passwordResetExpires = new Date("01/01/1970")

        await user.save();

        res.send(200)
    }catch(err){
        res.status(500).send({Error : 'error on process your request=> ' + err})
    }
})

module.exports = app => app.use('/auth', router)