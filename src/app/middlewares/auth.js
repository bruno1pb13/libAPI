require('dotenv').config()

const jwt = require("jsonwebtoken");

module.exports = (req,res,next) => {
    
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({Error: 'No token provider'})
    }

    const parts = authHeader.split(' '); // Bearer + hash

    if(!parts.length === 2){
        return res.status(500).send({Error: 'Error token'})
    }
    
    const [ scheme, token ] = parts;
    
    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({Error: 'Incorrect token format'})
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        if(err){
            return res.status(401).send({Error: 'Invalid token '})
        }

        req.userId = decoded.params.id
        return next();
    })
        
}