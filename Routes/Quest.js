const express = require('express')
const router = express.Router()
const {
    createQuests,
    getListQuests,
    getQuestById,
    updateQuests,
    removeQuests
} = require('../Controllers/Quest')
const {authCheck, adminCheck} = require('../Middleware/Auth')

router.post('/createQuests', authCheck, adminCheck, createQuests)

router.get('/getListQuests', authCheck, adminCheck, getListQuests)

router.get('/getQuestById/:id', authCheck, adminCheck, getQuestById)

router.put('/updateQuests', authCheck, adminCheck, updateQuests)

router.delete('/removeQuests/:id', authCheck, adminCheck, removeQuests)


module.exports = router