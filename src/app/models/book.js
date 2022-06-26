const mongoose = require('../../database');

const BookSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    pictures:{
        type: Object,
        require: false,
        select: false,
    },
    author: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Writers',
    },
    lang:{
        type:Object,
        required:true,
    },
    publisher:{
        type:String,
        required:false,
    },
    launch:{
        type:String,
        required:true,
    },
    more: {
        type: Object,
        select: false,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
})

// 

const Book = mongoose.model('Book', BookSchema)

module.exports = Book