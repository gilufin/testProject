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
            searchOptions: req.query,
            books: books
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

// View Book
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/book', {
            book: book
        })
    } catch (err) {
        res.redirect('/')
    }
})

// Edit form
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book)
    } catch (err) {
        res.redirect(`/books/${req.params.id}`)
    }
})

// Edit Book
router.put('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        if (req.body.title && req.body.title != '') book.title = req.body.title
        if (req.body.author && req.body.author != '') book.author = req.body.author
        if (req.body.publishDate && req.body.publishDate != '') book.publishDate = new Date(req.body.publishDate)
        if (req.body.pageCount && req.body.pageCount != '') book.pageCount = req.body.pageCount
        if (req.body.title && req.body.title != '') book.title = req.body.title
        if (req.body.description && req.body.description != '') book.description = req.body.description
        if (req.body.cover && req.body.cover != '') saveCover(book, req.body.cover)
        await book.save()
        res.redirect(`/books/${req.params.id}`)
    } catch (err) {
        renderEditPage(res, book, true)
    }
})


router.delete('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/')
    } catch {
        res.render('books/book', {
            book: book,
            errorMessage: 'Could not remove book'
        })
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

function renderNewPage(res, book, hasError) {
    return renderFormPage('new', res, book, hasError)
}

function renderEditPage(res, book, hasError) {
    return renderFormPage('edit', res, book, hasError)
}

async function renderFormPage(form, res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) {
            if (form == 'new') params.errorMessage = 'Error Creating Book'
            else if (form == 'edit') params.errorMessage = 'Error Updating Book'
        }
        res.render(`books/${form}.ejs`, params)
    } catch (err) {
        res.redirect('/books')
    }
}


module.exports = router