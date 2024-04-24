const express = require('express')
const app= express()
require('dotenv').config()
require('./database/Connection')

const port= process.env.PORT

//router
const TestRoute = require('./router/testRoute')
const UserRoute = require('./router/UserRoute')
const paymentRoute = require('./router/PaymentRoute')
const RoomRoute = require('./router/roomRoute')
//middleware
const cors = require('cors');
const bodyParser = require('body-parser')
const morgan = require('morgan')

//use middleware
app.use(bodyParser.json())
app.use(morgan('dev'))

//use routes
app.use(cors())
app.use(TestRoute)
app.use('/api',UserRoute)
app.use(paymentRoute)
app.use('/api',RoomRoute)

app.listen(port,()=>{
    console.log(`Server started at port: ${port}`)
})