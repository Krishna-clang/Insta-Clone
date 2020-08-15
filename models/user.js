const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePhoto: {
        type: String,
        default: "https://res.cloudinary.com/clang/image/upload/v1595959428/one_ubi04a.png",
    },
    followers: [{
        type: ObjectId,
        ref: "User",
        default: null
    }],
    followings: [{
        type: ObjectId,
        ref: "User",
        default: null
    }],
    token: String,
    expireToken: Date
})

mongoose.model("User", userSchema)