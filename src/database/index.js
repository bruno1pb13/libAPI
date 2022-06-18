require('dotenv').config()

const mongoose = require('mongoose');


process.env.NODE_ENV === 'test' ? 
    database = process.env.TESTE_DATABASE_URL : 
    database = process.env.DATABASE_URL


mongoose.connect(database);
mongoose.Promise = global.Promise;

module.exports = mongoose

