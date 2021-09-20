const express = require('express')
const router = express.Router()
const Author = require('../models/author.model')


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

// router.delete('/:name', async (req, res) => {
//     try {
//         const author = await Author.findOne({ name: req.params.name })
//         if (author == null) {
//             res.status(400).json({ message: 'cannot find this author' })
//         } else {
//             await author.remove()
//             res.status(201).send('delete succesfully')
//         }
//     } catch (err) {
//         res.status(500).json({ message: err.message })
//     }

// })


module.exports = router