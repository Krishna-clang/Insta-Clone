const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {mongourl} = require('./config/keys')
const port = process.env.PORT || 5000

require('./models/user')
require('./models/post')
mongoose.connect(mongourl,{
    useNewUrlParser: true ,
    useUnifiedTopology:true
})

mongoose.connection.on('connected',()=>{
    console.log("connected")
})
mongoose.connection.on('error',(err)=>{
    console.log("error connecting",err)
})


app.use(express.json())

if (process.env.NODE_ENV == "production") {
    app.use(express.static('frontend/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"frontend","build","index.html"))
    })
}

app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))
app.listen(port,()=>{
    console.log("Server Running")
})
