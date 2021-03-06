require('dotenv').config()

const authorsRouter = require('./routes/authors')
const booksRouter = require('./routes/books')
const indexRouter = require('./routes/index')
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

mongoose.connect(process.env.MONGO_CONNECTION_STRING)
db = mongoose.connection
db.on('error', (err) => console.error(err))
db.once('open', () => console.log('Connected to Mongoose'))

app.set('view engine', 'ejs')
app.set('views', './views')
app.set('layout', './layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

app.use('/', indexRouter)
app.use('/authors', authorsRouter)
app.use('/books', booksRouter)


app.listen(process.env.PORT, () => console.log('Server Started'))