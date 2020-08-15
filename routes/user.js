const express = require('express')
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const User = mongoose.model("User")
const router = express.Router()
const requireLogin = require('../middleware/requireLogin')

router.get('/user/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            Post.find({ postedBy: user._id })
                .populate("postedBy", "name profilePhoto followers followings email")
                .exec((err, data) => {
                    if (data.length  > 0) {      
                        return res.json({ data })
                    }
                    else{
                        return res.json({user})
                    }
                })
        })
})

router.post('/checkFollow', requireLogin, (req, res) => {
    User.findById(req.body.userId)
        .then(data => {
            if (data.followers.includes(req.user._id)) {
                return res.json({ following: true })
            }
            else {
                return res.json({ following: false })
            }
        })
})

router.put('/follow', requireLogin, (req, res) => {
    if (req.user._id === req.body.userId) {
        return res.json({ err: "Cannot Follow Our Self" })
    }
    else {
        User.findById(req.user._id)
            .then(data => {
                if (data.followers.includes(req.user._id)) {
                    return res.json({ err: "You are already following" })
                }
                else {
                    User.findById(req.body.userId)
                        .then(data => {
                            if (data.followers.includes(req.user._id)) {
                                res.json({ err: "Cannot follow 2 times" })
                            }
                            else {
                                User.findByIdAndUpdate(req.body.userId, {
                                    $push: { followers: req.user._id }
                                }, {
                                    new: true
                                })
                                    .exec((err, data) => {


                                        User.findByIdAndUpdate(req.user._id, {
                                            $push: { followings: req.body.userId }
                                        }, {
                                            new: true
                                        })
                                            .exec((err, data) => {
                                                if (data) {
                                                    User.findById(req.body.userId)
                                                        .then(result => {
                                                            result.password = undefined
                                                            data.password = undefined
                                                            res.json({ dataFollowing: result, dataFollower: data })
                                                        })
                                                }
                                            })

                                    })
                            }
                        })
                }
            })
    }
})

router.put('/unfollow', requireLogin, (req, res) => {
    User.findById(req.body.userId)
        .then(data => {
            User.findByIdAndUpdate(req.body.userId, {
                $pull: { followers: req.user._id }
            }, {
                new: true
            })
                .exec((err, data) => {
                    User.findByIdAndUpdate(req.user._id, {
                        $pull: { followings: req.body.userId }
                    }, {
                        new: true
                    })
                        .exec((err, data) => {
                            if (data) {
                                User.findById(req.body.userId)
                                    .then(result => {
                                        result.password = undefined
                                        data.password = undefined
                                        res.json({ dataFollowing: result, dataFollower: data })
                                    })
                            }
                        })
                })
        })

})

router.get('/getFollowUser', requireLogin, (req, res) => {
    User.findById(req.user._id)
        .populate("followings", "name _id email profilePhoto")
        .exec((err, data) => {
            if (data) {
                res.json({ data: data.followings })
            }
        }
        )
})

router.post('/search-users', (req, res) => {
    let userPattern = new RegExp("^" + req.body.search)
    User.find({ name: { $regex: userPattern } })
    .select("_id name email")
        .then(user => res.json({ user }))
})


module.exports = router