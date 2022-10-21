const express = require('express')
const Thought = require('../models/Thought')
const router = express.Router()
const ThoughtsController = require('../controllers/ThoughtsController')

//helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/create', checkAuth, ThoughtsController.createThought)
router.post('/add', checkAuth, ThoughtsController.addThought)
router.get('/edit/:id', checkAuth, ThoughtsController.editThought)
router.post('/edit/:id', checkAuth, ThoughtsController.updateThought)
router.post('/remove', checkAuth, ThoughtsController.removeThought)
router.get('/dashboard', checkAuth, ThoughtsController.dashboard)
router.get('/', ThoughtsController.showThoughts)

module.exports = router