const mongoose = require('../../database');

const WritersSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    profilePicture:{
        type: String,
        require: false,
        select: false,
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
})

// 

const Writers = mongoose.model('Writers', WritersSchema)

module.exports = Writers