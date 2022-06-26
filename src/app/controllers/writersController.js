const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth')

const Writers = require('../models/writers')

// router.use(authMiddleware)

router.put('/', async(req,res)=>{
    try{
        const {name} = req.body
        
        const r = await Writers.create({name})

        if(!r){
            return res.status(400).send({Error: '[Book] : Fail on create writer => ', Error})
        }

        return res.send(r)

    }catch(err){
        return res.status(400).send({Error: '[Book] : Fail on create writer => ', Error})
    }
})

router.get('/:id', async(req,res)=>{
    try{
        id = req.params.id
        const r = await Writers.findById(id)

        if(!r){
            return res.status(400).send({Error: '[Book] : Fail on get writer=> ', Error})
        }

        return res.send(r)


    }catch(err){
        return res.status(400).send({Error: '[Book] : Fail on get writer => ', Error})
    }
})

router.get('/', async(req,res)=>{
    try{

        //filter to all params in the request
        let {names, maxResults} = req.body

        !maxResults || typeof(maxResults) !== 'number' ? maxResults = 1 : maxResults

        if(!names){
            return res.send(await Writers.find().sort({
                'name' : 1.0
            }).limit(maxResults))	
        }

        names.map((n, index)=>{
            names[index] = new RegExp(n, 'i')
        })

        res.send(await Writers.find({
            name: names
        }).sort({'name' : 1.0}))

    }catch(err){
        return res.status(400).send({Error: '[Book] : Fail on search writers => ', Error})
    }

});

module.exports = app => app.use('/writer', router)


// generate random names
// const names = ['John', 'Jane', 'Mary', 'Mark', 'Bob', 'Tom', 'John', 'Jane', 'Mary', 'Mark', 'Bob', 'Tom']
// const randomNames = names.sort(() => Math.random() - 0.5)
// console.log(randomNames)


