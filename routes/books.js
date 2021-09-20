const express = require('express')
const router = express.Router()
const Author = require('../models/author.model')
const Book = require('../models/book.model')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})


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
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file ? req.file.filename : null
    const newBook = new Book({
        title: req.body.title,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        author: req.body.author,
        pageCount: req.body.pageCount,
        coverImageName: fileName
    })

    try {
        const savedBook = await newBook.save()
        // res.redirect(`/books/${savedBook.id`)
        res.redirect('/books')
    } catch (err) {
        if (newBook.coverImageName) removeBookCover(newBook.coverImageName)
        renderNewPage(res, newBook, true)
    }
})

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

function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
        else console.log('File Deleted : ' + fileName)
    })
}

module.exports = router