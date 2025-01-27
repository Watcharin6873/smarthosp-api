const prisma = require('../Config/Prisma')
const jwt = require('jsonwebtoken')


exports.authCheck = async (req, res, next)=>{
    try {
        //Code
        const headerToken = req.headers.authorization

        if(!headerToken){
            return res.status(401).json({
                message: "No Token, Authorization"
            })
        }

        const token = headerToken.split(" ")[1]
        const decode = jwt.verify(token, process.env.SECRET)
        req.user = decode

        const { email, firstname_th, lastname_th, hcode, } = req.user
        const user = await prisma.users.findFirst({
            where:{
                email: email,
                firstname_th: firstname_th,
                lastname_th: lastname_th,
                hcode: hcode
            }
        })
        if(!user.enabled){
            return res.status(400).json({
                message: "Account นี้ยังไม่ได้รับการอนุมัติ!"
            })
        }

        next()

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Token Invalid!"
        })
    }
}

exports.adminCheck = async (req, res, next)=>{
    try {
        //Code
        const { email, firstname_th, lastname_th, hcode } = req.user
        const adminUser = await prisma.users.findFirst({
            where:{
                email: email,
                firstname_th: firstname_th,
                lastname_th: lastname_th,
                hcode: hcode,
            }
        })
        if(!adminUser || adminUser.role !== "admin"){
            return res.status(403).json({
                message: "Access denied, admin only!"
            })
        }

        next()
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Error admin access denied. "
        })
    }
}