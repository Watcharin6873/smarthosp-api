const express = require('express')
const router = express.Router()
const {report_evaluate_all} = require('../Controllers/Report')


router.get('/report_evaluate_all', report_evaluate_all)


module.exports = router