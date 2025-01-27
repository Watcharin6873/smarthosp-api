const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const {readdirSync} = require('fs')

//Middleware
app.use(morgan('dev'))
app.use(bodyParser.json({limit:'20mb'}))
app.use(cors())
app.use("/api/smarthosp/file-uploads", express.static("file-uploads"))
app.use("/api/smarthosp/cyber-image", express.static("cyber-image"))



//Routing
readdirSync('./Routes').map((r)=> app.use('/api/smarthosp', require('./Routes/'+r)))

//Port
const port = process.env.PORT
//Start Server
app.listen(port,
    ()=> console.log('Server is running on port 5004')
)