const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const bcrypt = require('bcryptjs')
const { jwt_secret, apiKey } = require('../config/keys')
const jwt = require('jsonwebtoken')
const User = mongoose.model("User")
const nodemailer = require('nodemailer')
const sendGrid = require('nodemailer-sendgrid-transport')
const requiredLogin = require('../middleware/requireLogin')
const crypto = require('crypto')

const transport = nodemailer.createTransport(sendGrid({
    auth: {
        api_key: apiKey
    }
}))

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body
    if (!email || !name || !password) {
        res.status(422).json({ error: "Please Fill Credentials" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "Email Already In Database" })
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                    })
                    user.save()
                        .then(saved => {
                            res.json({ message: "Saved Sucessfully login with email to post data" })
                        })
                        .catch(err => {
                            res.json({ err })
                        })
                })
                .catch(err => {
                    res.json({ err })
                })
        })
        .catch(err => {
            res.json({ err })
        })
})

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ err: "Credentials not filled" })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.json({ err: "Invalid email or password" })
            }
            bcrypt.compare(password, savedUser.password)
                .then(didMatch => {
                    if (didMatch) {
                        const token = jwt.sign({ _id: savedUser._id }, jwt_secret)
                        savedUser.password = null
                        res.json({ token, user: savedUser })
                    }
                    else {
                        res.json({ err: "error here" });
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
        })
})


router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buf) => {
        const token = buf.toString("hex")
        User.findOne({ email: req.body.emailId })
            .then(user => {
                if (user) {
                    user.token = token
                    user.expireToken = Date.now() + 3600000
                    user.save()
                    transport.sendMail({
                        to: user.email,
                        from: "kadevelopment2003@gmail.com",
                        subject: "You have asked to reset the password click the link to generate new password",
                        html: `<h1>Click the link</h1>
                <br />
                <a href = 'http://localhost:3000/reset/${token}'>Reset Password</a>
            `
                    })
                        .then(({ message }) => {
                            if (message == "success") {
                                res.json({ message: "Check your inbox to change password" })
                            }
                        })
                }
                else {
                    return res.json({ message: "User Not found" })
                }
            })


    })
})


router.post('/reset', (req, res) => {
    User.findOne({ token: req.body.token, expireToken: { $gt: Date.now() } })
        .then(response => {
            if (!response) {
                return res.json({ err: "Session Expired" })
            }
            bcrypt.hash(req.body.password, 12)
                .then(hashedPassword => {
                    response.password = hashedPassword
                    response.token = undefined
                    response.expireToken = undefined
                    response.save()
                        .then(savedUser => {
                            if (savedUser) {
                                return res.json({ message: "Password Updated" })
                            }
                        })
                })
        })
})


module.exports = router