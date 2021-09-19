const express = require('express')
const router = express.Router()
const Author = require('../models/author.model')


// Getting All Authors
router.get('/', async (req, res) => {
    let searchOptions = {}
    searchName = req.query.name ? req.query.name.trim() : ''
    searchOptions.name = RegExp(searchName)
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', { authors: authors, searchOptions: { name: searchName } })
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

    const newAuthor = new Author({
        name: req.body.name
    })
    try {
        const savedAuthor = await newAuthor.save()
        res.redirect('authors')
    } catch (err) {
        res.render('authors/new', {
            author: newAuthor,
            errorMessage: err.message
        })
    }
})



module.exports = router