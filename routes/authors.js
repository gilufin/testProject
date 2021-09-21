const express = require('express')
const router = express.Router()
const Author = require('../models/author.model')
const Book = require('../models/book.model')

// Getting All Authors
router.get('/', async (req, res) => {
    let searchOptions = {}
    searchOptions.name = RegExp(req.query.name, 'i')
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', { authors: authors, searchOptions: req.query })
    } catch (err) {
        res.redirect('/')
    }
})

// The form to Create New Author
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

// Create New Author
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect(`/authors/${newAuthor.id}`)
    } catch (err) {
        res.render('authors/new', {
            author: author,
            errorMessage: err.message
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: req.params.id })
        res.render('authors/author', { books: books, author: author, errorMessage: req.query.err })
    } catch (err) {
        res.send(err)
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    } catch (err) {
        res.redirect('/authors')
    }
})

router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        if (req.body.name && req.body.name != '') author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${req.params.id}`)
    } catch (err) {
        if (author) {
            res.render('authors/edit', {
                author: author,
                errorMessage: err.message
            })
        } else {
            res.redirect('/')
        }
    }
})

router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect('/authors')
    } catch (err) {
        if (author) {
            res.redirect(`/authors/${req.params.id}?err=${err.message}`)
        } else {
            res.redirect('/')
        }
    }
})

module.exports = router