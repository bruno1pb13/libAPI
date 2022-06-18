require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.get('/', (req,res)=>{
    res.status(200).send('welcome')
})

require('../app/controllers/index')(app)

let server = ()=>{

    port = process.env.PORT || 3000

    function start(){
        app.listen(port, ()=>{
            console.log("Server running on port: "+ port)
        })
    }
    
    return {start}
}

module.exports = server;