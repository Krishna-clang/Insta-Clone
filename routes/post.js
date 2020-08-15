const express = require('express')
const mongoose = require('mongoose')
const Post = mongoose.model("Post")
const User = mongoose.model("User")
const router = express.Router()
const requireLogin = require('../middleware/requireLogin')

router.get('/allposts', (req, res) => {
    Post.find()
        .populate("postedBy", "_id name createdAt like unlike heart")
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/profilephoto', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: { profilePhoto: req.body.pic }
    }, {
        new: true
    })
        .exec((err, data) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log(data)
                res.json({ data })
            }
        })
})

router.post('/createpost', requireLogin, ((req, res) => {
    const { title, body, pic } = req.body
    console.log({ title, body, pic })
    if (!title || !body || !pic) {
        return res.status(422).json({ error: "Please fill the field" })
    }
    req.user.password = undefined
    console.log(req.user)
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user
    })
    post.save()
        .then(savePhoto => {
            res.json({ message: "Image Uploaded Successfully" })
        })
        .catch(err => {
            console.log(err)
        })
}))

router.put('/like', requireLogin, (req, res) => {
    Post.findById(req.body.postId)
        .exec((err, result) => {
            if (result.unlike.includes(req.user._id)) {
                Post.findByIdAndUpdate(req.body.postId, {
                    $pull: { unlike: req.user._id }
                }, {
                    new: true
                })
                    .exec((err, data) => {
                        if (data) {
                            Post.findByIdAndUpdate(req.body.postId, {
                                $push: { like: req.user._id }
                            }, {
                                new: true,
                            })
                                .exec((err, data) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                    else {
                                        return res.json({ heart: data.heart.length, like: data.like.length, unlike: data.unlike.length })
                                    }
                                })
                        }
                    })
            }
            else {
                Post.findById(req.body.postId)
                    .exec((err, result) => {
                        if (result.like.includes(req.user._id)) {
                            Post.findByIdAndUpdate(req.body.postId, {
                                $pull: { like: req.user._id }
                            }, {
                                new: true,
                            })
                                .exec((err, data) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                    else {
                                        return res.json({ heart: data.heart.length, like: data.like.length, unlike: data.unlike.length })
                                    }
                                })
                        }
                        else {
                            Post.findByIdAndUpdate(req.body.postId, {
                                $push: { like: req.user._id }
                            }, {
                                new: true,
                            })
                                .exec((err, data) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                    else {
                                        return res.json({ heart: data.heart.length, like: data.like.length, unlike: data.unlike.length })
                                    }
                                })
                        }
                    })

            }
        })
})

router.put('/unlike', requireLogin, (req, res) => {
    Post.findById(req.body.postId)
        .exec((err, result) => {
            if (result.like.includes(req.user._id)) {
                Post.findByIdAndUpdate(req.body.postId, {
                    $pull: { like: req.user._id }
                }, {
                    new: true
                })
                    .exec((err, data) => {
                        if (data) {
                            Post.findByIdAndUpdate(req.body.postId, {
                                $push: { unlike: req.user._id }
                            }, {
                                new: true,
                            })
                                .exec((err, data) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                    else {
                                        return res.json({ heart: data.heart.length, like: data.like.length, unlike: data.unlike.length })
                                    }
                                })
                        }
                    })
            }
            else {
                Post.findById(req.body.postId)
                    .exec((err, result) => {
                        if (result.unlike.includes(req.user._id)) {
                            Post.findByIdAndUpdate(req.body.postId, {
                                $pull: { unlike: req.user._id }
                            }, {
                                new: true,
                            })
                                .exec((err, data) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                    else {
                                        return res.json({ heart: data.heart.length, like: data.like.length, unlike: data.unlike.length })
                                    }
                                })
                        }
                        else {
                            Post.findByIdAndUpdate(req.body.postId, {
                                $push: { unlike: req.user._id }
                            }, {
                                new: true,
                            })
                                .exec((err, data) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                    else {
                                        return res.json({ heart: data.heart.length, like: data.like.length, unlike: data.unlike.length })
                                    }
                                })
                        }
                    })

            }
        })
})

router.get('/userposts', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name createdAt like unlike heart email")
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.put('/heart', requireLogin, (req, res) => {
    Post.findById(req.body.postId)
        .exec((err, data) => {
            if (data.heart.includes(req.user._id)) {
                Post.findByIdAndUpdate(req.body.postId, {
                    $pull: { heart: req.user._id }
                }, {
                    new: true,
                })
                    .exec((err, result) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            return res.json({ heart: result.heart.length, like: result.like.length, unlike: result.unlike.length })
                        }
                    })
            }
            else {
                Post.findByIdAndUpdate(req.body.postId, {
                    $push: { heart: req.user._id }
                }, {
                    new: true
                })
                    .exec((err, data) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            return res.json({ heart: data.heart.length, like: data.like.length, unlike: data.unlike.length })
                        }
                    })
            }
        })
})

router.put('/comment', requireLogin, (req, res) => {
    let userId = req.user._id
    Post.findById(req.body.postId)
        .populate("comment.commentedBy", "_id name")
        .exec((err, data) => {
            if (err) {
                console.log(err)
            }
            else {
                Post.findByIdAndUpdate(req.body.postId, {
                    $push: { comment: { commentedBy: userId, comment: req.body.comment } }
                }, {
                    new: true
                })
                    .populate("comment.commentedBy", "_id name profilePhoto")
                    .exec((err, data) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            res.json({ data })
                        }
                    })
            }
        })
})




router.post('/comment', (req, res) => {
    Post.findById(req.body.postId)
        .populate("comment.commentedBy", "_id name profilePhoto")
        .exec((err, data) => {
            if (data) {
                res.json({ data })
            }
            else {
                console.log(err)
            }
        })
})

router.get('/userPhoto', requireLogin, (req, res) => {
    User.findById(req.user._id)
        .exec((err, data) => {
            if (data) {
                res.json({ data: data.profilePhoto })
            }
        })
})

router.get('/specificpost', requireLogin, (req, res) => {
    Post.findById(req.user._id)
        .exec((err, data) => {
            if (data) {
                res.json({ data })
            }
        })
})

router.post('/getPost',(req,res)=>{
    Post.findById(req.body._id)
    .populate("comment.commentedBy","_id name")
    .exec((err,data)=>{
        res.json({data})
    })
})

module.exports = router