const express = require('express')
const router = express.Router()
const { authCheck } = require('../Middleware/Auth')
const {
    getListHospitalAll,
    getHospitalOnProv,
    getListHospitalOnZone
} = require('../Controllers/Hospitals')


router.get('/getListHospitalAll', getListHospitalAll)

router.get('/getHospitalOnProv/:province',authCheck, getHospitalOnProv)

router.get('/getListHospitalOnZone/:zone',authCheck, getListHospitalOnZone)


module.exports = router