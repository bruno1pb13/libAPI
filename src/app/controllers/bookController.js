const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth')

const Book = require('../models/book')

router.use(authMiddleware)

router.put('/new', async(req,res)=>{
    try{
        let book = req.body

        book.createdBy = req.userId
        
        book = await Book.create(book)

        if(!book){
            return res.status(400).send({Error: '[Book] : Fail on create book => ', Error})
        }

        return res.send(book)

    }catch(err){
        return res.status(400).send({Error: '[Book] : Fail on create book => ', Error})
    }
})

router.get('/:id', async(req,res)=>{
    try{

        const id = req.params.id
        userId = req.userId

        const book = await Book.findById(id).populate(['author'])

        if(!book){
            return res.status(400).send({Error: '[Book] : Fail on create book => ', Error})
        }

        return res.send(book)

    }catch(err){
        return res.status(400).send({Error: '[Book] : Fail on create book => ', Error})
    }
})



module.exports = app => app.use('/book', router)