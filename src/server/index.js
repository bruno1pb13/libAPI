require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/', (req,res)=>{
    res.status(200).send('welcome')
})

require('../app/controllers/index')(app)

let server = ()=>{
    function start(){
        app.listen(process.env.PORT || 3000, ()=>{
            console.log("Server running")
        })
    }
    
    return {start}
}

module.exports = server;