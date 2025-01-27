const express = require('express')
const router = express.Router()
const { authCheck } = require('../Middleware/Auth')
const {
    saveSsjApproved,
    saveZoneApproved,
    getListSsjApproved,
    getListZoneApproved
} = require('../Controllers/Approve')

router.post('/saveSsjApproved', authCheck, saveSsjApproved)

router.get('/getListSsjApproved', authCheck, getListSsjApproved)

router.post('/saveZoneApproved',authCheck, saveZoneApproved)

router.get('/getListZoneApproved',authCheck, getListZoneApproved)


module.exports = router