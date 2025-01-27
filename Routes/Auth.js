const express = require('express')
const router = express.Router()

const { 
    registerByProviderID, 
    loginByProviderID,
    currentUser
 } = require('../Controllers/Auth')
 const {authCheck, adminCheck} = require('../Middleware/Auth')


router.post('/registerByProviderID', registerByProviderID)

router.post('/loginByProviderID', loginByProviderID)

router.post('/current-user',authCheck, currentUser)

router.post('/current-admin',authCheck, adminCheck, currentUser)


module.exports = router