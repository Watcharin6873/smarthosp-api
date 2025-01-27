const express = require('express')
const router = express.Router()
const { createSubQuestList2,getSubQuetList } = require('../Controllers/SubQuestList')
const { authCheck, adminCheck } = require('../Middleware/Auth')

router.post('/createSubQuestList2',authCheck,adminCheck, createSubQuestList2)

router.get('/getSubQuetList', authCheck, getSubQuetList)

module.exports = router