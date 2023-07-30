const express = require('express')
const app= express()
require('dotenv').config()
require('./database/Connection')

const port= process.env.PORT

//router
const TestRoute = require('./router/testRoute')
const UserRoute = require('./router/UserRoute')
//middleware
const bodyParser = require('body-parser')
const morgan = require('morgan')

//use middleware
app.use(bodyParser.json())
app.use(morgan('dev'))

//use routes
app.use(TestRoute)
app.use('/api',UserRoute)

app.listen(port,()=>{
    console.log(`Server started at port: ${port}`)
})