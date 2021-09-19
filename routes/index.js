const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    try {
        res.render('index')
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
})



module.exports = router