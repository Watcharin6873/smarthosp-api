const express = require('express')
const router = express.Router()
const {report_evaluate_all, reportForPivot} = require('../Controllers/Report')
const {authCheck} = require('../Middleware/Auth')


router.get('/report_evaluate_all', report_evaluate_all)

router.get('/reportForPivot', authCheck, reportForPivot)


module.exports = router