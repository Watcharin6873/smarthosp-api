const express = require('express')
const router = express.Router()

const {
    createCategory,
    getListCategory,
    getCategoryById,
    updateCategory,
    removeCategory
} = require('../Controllers/CategoryQuest')
const { authCheck, adminCheck } = require('../Middleware/Auth')

router.post('/createCategory', authCheck, adminCheck, createCategory)

router.get('/getListCategory', authCheck, adminCheck, getListCategory)

router.get('/getCategoryById/:id', authCheck, adminCheck, getCategoryById)

router.put('/updateCategory', authCheck, adminCheck, updateCategory)

router.delete('/removeCategory/:id', authCheck, adminCheck, removeCategory)


module.exports = router