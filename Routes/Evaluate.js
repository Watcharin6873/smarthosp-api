const express = require('express')
const router = express.Router()
const {
    saveEvaluates,
    getListEvaluateAll,
    getEvaluateByHosp,
    getEvaluateByHosp2,
    getListEvaluateByHosp,
    getListEvaluateByHosp2,
    getListEvaluateByProv,
    getListEvaluateByZone,
    refreshEvaluate,
    getEvaluateById,
    updateChoiceEvaluate,
    saveDocuments,
    saveEvidenceAll,
    getEvidenceFromEvaluate,
    getDocumentsByEvaluateByHosp,
    truncateTable,
    sumEvaluateByHosp,
    saveEvaluates2,
    uploadFileById,
    ssjChangeStatusApprove,
    zoneChangeStatusApprove,
    uploadCyberImageFile,
    getCyberSecurityLevelData,
    removeFileById,
    splitComma,
    getSumEvaluateByZone,
    getSumEvaluateForAll,
    checkSsjNotApprove,
    checkZoneNotApprove,
    ssjUnApprove,
    zoneUnApprove,
    getHospitalInListEvaluate, 
    sumEvaluateAll,
    getSumEvaluateByProv,
    getEvaluateForBarChartStackZone
} = require('../Controllers/Evaluate')
const { authCheck } = require('../Middleware/Auth')
const { uploadFile } = require('../Middleware/UploadFile')
const { uploadAllTypeFile } = require('../Middleware/UploadAllTypeFile')
const { uploadCyberImage } = require('../Middleware/UploadCyberImage')


router.post('/saveEvaluates', authCheck, saveEvaluates)

router.get('/getListEvaluateAll', getListEvaluateAll)

router.get('/getHospitalInListEvaluate', getHospitalInListEvaluate)

router.get('/getSumEvaluateForAll', getSumEvaluateForAll)

router.get('/sumEvaluateAll', sumEvaluateAll)

router.get('/getEvaluateForBarChartStackZone', getEvaluateForBarChartStackZone)

router.post('/saveEvaluates2', authCheck, uploadAllTypeFile, saveEvaluates2)

router.post('/uploadCyberImageFile', authCheck, uploadCyberImage, uploadCyberImageFile)

router.get('/getListEvaluateByHosp/:hcode', authCheck, getListEvaluateByHosp)

router.get('/getListEvaluateByHosp2/:hcode', authCheck, getListEvaluateByHosp2)

router.get('/getListEvaluateByProv/:province', authCheck, getListEvaluateByProv)

router.get('/getListEvaluateByZone/:zone', authCheck, getListEvaluateByZone)

router.get('/getCyberSecurityLevelData', authCheck, getCyberSecurityLevelData)

router.get('/refreshEvaluate', authCheck, refreshEvaluate)

router.get('/sumEvaluateByHosp', authCheck, sumEvaluateByHosp)

router.get('/getEvaluateByHosp', authCheck, getEvaluateByHosp)

router.get('/getEvaluateByHosp2', authCheck, getEvaluateByHosp2)

router.get('/getEvaluateById/:id', authCheck, getEvaluateById)

router.put('/updateChoiceEvaluate', authCheck, updateChoiceEvaluate)

router.post('/saveDocuments', authCheck, uploadFile, saveDocuments)

router.post('/saveEvidenceAll', authCheck, uploadAllTypeFile, saveEvidenceAll)

router.put('/uploadFileById/:id', authCheck, uploadAllTypeFile, uploadFileById)

router.get('/removeFileById/:id', authCheck, removeFileById)

router.put('/ssjChangeStatusApprove', authCheck, ssjChangeStatusApprove)

router.put('/zoneChangeStatusApprove', authCheck, zoneChangeStatusApprove)

router.put('/ssjUnApprove', authCheck, ssjUnApprove)

router.put('/zoneUnApprove', authCheck, zoneUnApprove)

router.get('/getEvidenceFromEvaluate', authCheck, getEvidenceFromEvaluate)

router.get('/getDocumentsByEvaluateByHosp', authCheck, getDocumentsByEvaluateByHosp)

router.get('/splitComma', authCheck, splitComma)

router.get('/getSumEvaluateByProv', authCheck, getSumEvaluateByProv)

router.get('/getSumEvaluateByZone', authCheck, getSumEvaluateByZone)

router.delete('/truncateTable', authCheck, truncateTable)

router.get('/checkSsjNotApprove',authCheck, checkSsjNotApprove)

router.get('/checkZoneNotApprove', authCheck, checkZoneNotApprove)



module.exports = router