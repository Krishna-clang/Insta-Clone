const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    postedBy: {
        type: ObjectId,
        ref: "User",
    },
    like: [{
        type : ObjectId,
        ref : "User"
    }],
    unlike: [{
        type: ObjectId,
        ref: "User"
    }],
    heart: [{
        type: ObjectId,
        ref: "User"
    }],
    comment : [{
        commentedBy  : {
            type : ObjectId,
            ref : "User"
        },
        comment :{
            type :String,
            default: null,
        },
    }]
}, { timestamps: true })

mongoose.model("Post", postSchema)