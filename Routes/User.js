const express = require('express')
const router = express.Router()
const {
    getListUsers,
    getListUsersZoneApprove,
    getListUsersByProv,
    getListUsersByZone,
    getListUserById,
    changeStatus,
    changeRole,
    changeLevel,
    changeObjective,
    removeUser,
    approveUserOnProv,
    notApproveUserOnProv,
    approveUserOnZone,
    notApproveUserOnZone
} = require('../Controllers/User')
const { authCheck, adminCheck } = require('../Middleware/Auth')

router.get('/getListUsers', authCheck, adminCheck, getListUsers)

router.get('/getListUsersZoneApprove', authCheck, adminCheck, getListUsersZoneApprove)

router.get('/getListUsersByProv', authCheck, getListUsersByProv)

router.get('/getListUsersByZone', authCheck, getListUsersByZone)

router.get('/approveUserOnProv/:province', authCheck, approveUserOnProv)

router.get('/notApproveUserOnProv/:province', authCheck, notApproveUserOnProv)

router.get('/approveUserOnZone/:zone', authCheck, approveUserOnZone)

router.get('/notApproveUserOnZone/:zone', authCheck, notApproveUserOnZone)

router.get('/getListUserById/:id', authCheck, adminCheck, getListUserById)

router.put('/changeStatus', authCheck, adminCheck, changeStatus)

router.put('/changeRole', authCheck, adminCheck, changeRole)

router.put('/changeLevel', authCheck, adminCheck, changeLevel)

router.put('/changeObjective', authCheck, adminCheck, changeObjective)

router.delete('/removeUser/:id', authCheck, adminCheck, removeUser)


module.exports = router