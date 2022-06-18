require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

require('../app/controllers/index')(app)

let server = ()=>{
    function start(){
        app.listen(3000, ()=>{
            console.log("Server running")
        })
    }
    
    return {start}
}

module.exports = server;