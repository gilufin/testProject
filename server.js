require('dotenv').config()

const indexRouter = require('./routes/index')
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_CONNECTION_STRING)
db = mongoose.connection
db.on('error', (err) => console.error(err))
db.once('open', () => console.log('Connected to Mongoose'))

app.set('view engine', 'ejs')
app.set('views', './views')
app.set('layout', './layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))


app.use('/', indexRouter)


app.listen(process.env.PORT, () => console.log('Server Started'))