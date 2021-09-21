const express = require('express')
const router = express.Router()
const Author = require('../models/author.model')
const Book = require('../models/book.model')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// Getting All Books
router.get('/', async (req, res) => {
    searchOptions = {
        title: RegExp(req.query.title, 'i')
    }
    publishRange = {}

    if (req.query.publishedBefore) publishRange.$lte = req.query.publishedBefore
    if (req.query.publishedAfter) publishRange.$gte = req.query.publishedAfter
    if (Object.keys(publishRange).length) searchOptions.publishDate = publishRange

    // console.log(searchOptions)
    try {
        const books = await Book.find(searchOptions)
        res.render('books/index', {
            searchOptions: req.query, books: books
        })
    } catch (err) {
        console.error(err)
        res.redirect('/')
    }
})

// The form to Create New Book
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

// Create new Book
router.post('/', async (req, res) => {
    const newBook = new Book({
        title: req.body.title,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        author: req.body.author,
        pageCount: req.body.pageCount,
    })
    saveCover(newBook, req.body.cover)

    try {
        const savedBook = await newBook.save()
        // res.redirect(`/books/${savedBook.id`)
        res.redirect('/books')
    } catch (err) {
        renderNewPage(res, newBook, true)
    }
})

function saveCover(book, coverEncoded) {
    if (!coverEncoded) return
    const cover = JSON.parse(coverEncoded)
    if (cover && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = 'Error Creating Book'
        res.render('books/new.ejs', params)
    } catch (err) {
        res.redirect('/books')
    }
}


module.exports = router